import fs from 'fs'
import path from 'path'

interface TreeNode {
  name: string
  path?: string
  isDirectory: boolean
  children: TreeNode[]
}

/**
 * 校验扫描根必须是 VitePress 文档站目录（其下存在 .vitepress），
 * 防止误传仓库根把非文档内容卷进目录树。
 */
function assertDocsScanRoot(rootDir: string): string {
  const absRoot = path.resolve(rootDir)

  if (!fs.existsSync(path.join(absRoot, '.vitepress'))) {
    throw new Error(
      `[directory] 扫描根必须是文档站目录（其下需存在 .vitepress），当前为: ${absRoot}`
    )
  }

  const monorepoMarkers = ['settings.gradle.kts', 'settings.gradle', 'gradlew.bat', 'gradlew']
  for (const marker of monorepoMarkers) {
    if (fs.existsSync(path.join(absRoot, marker))) {
      throw new Error(
        `[directory] 禁止扫描仓库根，请传入文档站目录（当前: ${absRoot}，检测到 ${marker}）`
      )
    }
  }

  return absRoot
}

/**
 * 同层排序：目录优先，同类按名称，保证树输出稳定连贯
 */
function sortTreeNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) {
      return a.isDirectory ? -1 : 1
    }
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
  })
}

/**
 * 扫描目录生成树结构
 *
 * @param skipName 输出文件本身的文件名，扫描时跳过，避免把自动生成的目录页收进目录
 */
function scanDirectory(dirPath: string, basePath: string = '', skipName: string = ''): TreeNode[] {
  const items: TreeNode[] = []

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      // 跳过隐藏文件、构建产物与依赖
      if (entry.name.startsWith('.') ||
          entry.name === 'node_modules' ||
          entry.name === '.vitepress' ||
          entry.name === 'dist' ||
          entry.name === 'cache' ||
          entry.name === skipName ||
          entry.name === 'package.json' ||
          entry.name === 'package-lock.json') {
        continue
      }

      const fullPath = path.join(dirPath, entry.name)
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        const children = scanDirectory(fullPath, relativePath, skipName)

        // 没有任何文档的目录不收录
        if (children.length === 0) continue

        const indexPath = path.join(fullPath, 'index.md')
        const hasIndex = fs.existsSync(indexPath)

        items.push({
          name: entry.name,
          path: hasIndex ? `/${relativePath}/` : undefined,
          isDirectory: true,
          children
        })
      } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
        const nameWithoutExt = entry.name.replace(/\.md$/, '')
        items.push({
          name: nameWithoutExt,
          path: `/${relativePath.replace(/\.md$/, '')}`,
          isDirectory: false,
          children: []
        })
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error)
  }

  return sortTreeNodes(items)
}

/**
 * 生成连贯的 HTML 树状结构
 *
 * 祖先层用 `│   ` 保持竖线连续，仅当前节点为末项时其子树改用空白缩进。
 */
function generateHtmlTree(nodes: TreeNode[], prefix: string = ''): string {
  let result = ''

  nodes.forEach((node, index) => {
    const isLastItem = index === nodes.length - 1
    const connector = isLastItem ? '└── ' : '├── '

    if (node.isDirectory) {
      const label = node.path
        ? `<a href="${node.path}">${node.name}/</a>`
        : `${node.name}/`
      result += `${prefix}${connector}${label}\n`
      result += generateHtmlTree(
        node.children,
        prefix + (isLastItem ? '    ' : '│   ')
      )
    } else {
      const link = `<a href="${node.path}">${node.name}</a>`
      result += `${prefix}${connector}${link}\n`
    }
  })

  return result
}

/**
 * 内容不变时不落盘。
 *
 * generateDirectory 会被配置加载、Vite buildStart、dev 监听等多处反复调用，
 * 如果每次都无条件写文件，dev 下会形成「写入 → 监听到变更 → 页面重变换 →
 * 再写入」的自触发循环，必须保证内容相同就不产生文件变更事件。
 */
function writeIfChanged(outputFile: string, content: string): boolean {
  try {
    if (fs.existsSync(outputFile) && fs.readFileSync(outputFile, 'utf-8') === content) {
      return false
    }
  } catch {
    // 读取失败时退回直接覆写
  }
  fs.writeFileSync(outputFile, content, 'utf-8')
  return true
}

/**
 * 生成目录文件
 *
 * @param rootDir 文档站根目录（即 .vitepress 的父目录）
 * @param outputFile 目录文件输出路径
 */
export function generateDirectory(rootDir: string, outputFile: string) {
  const docsSiteRoot = assertDocsScanRoot(rootDir)
  const skipName = path.basename(outputFile)

  const tree = scanDirectory(docsSiteRoot, '', skipName)
  const htmlTree = generateHtmlTree(tree)

  const content = `---
editLink: false
---

# 文档目录

<!--
  此文件由程序自动生成，禁止手动修改！
  无论是人类开发者还是 AI Agent，都不要在此文件中添加、删除或修改任何内容。
  每一次构建都会自动重新生成此文件，任何手动修改都会被覆盖。
-->

::: tip
本页面由系统自动生成，无需自行维护
:::
<pre>
${htmlTree}
</pre>
`

  if (writeIfChanged(outputFile, content)) {
    console.log(`[directory] 目录已生成: ${outputFile}`)
  } else {
    console.log('[directory] 目录无变化，跳过写入')
  }
}

/**
 * dev 监听重建用的 Vite 插件。
 *
 * 只负责 dev 文件监听与构建链路兜底；配置加载阶段的首次生成由
 * config.mts 顶层直接调用 generateDirectory 完成（必须早于 VitePress
 * 扫描 .md，否则目录页进不了本次构建）。重建是幂等的：内容不变不落盘，
 * 因此不会产生「写入自己的输出 → 触发自己的监听」的死循环。
 */
export function directoryVitePlugin(rootDir: string, outputFile: string) {
  let lastGenerateAt = 0

  const regenerate = (reason: string) => {
    const now = Date.now()
    if (now - lastGenerateAt < 50) {
      return
    }
    lastGenerateAt = now
    try {
      generateDirectory(rootDir, outputFile)
    } catch (error) {
      console.error('[directory] regenerate failed', error)
    }
  }

  return {
    name: 'docs-directory-lifecycle',
    buildStart() {
      regenerate('vite.buildStart')
    },
    configureServer(server: {
      watcher: {
        on: (event: string, cb: (file: string) => void) => void
      }
      ws: { send: (payload: { type: string; path?: string }) => void }
    }) {
      regenerate('dev-server-start')

      const siteRoot = path.resolve(rootDir)
      const outName = path.basename(outputFile)
      const reloadPath = `/${outName.replace(/\.md$/, '')}`

      const onFsChange =
        (eventName: 'change' | 'add' | 'unlink') =>
        (file: string) => {
          const rel = path.relative(siteRoot, file)
          // 只关心站点内的 .md 变更
          if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return
          if (!rel.endsWith('.md')) return
          if (rel.startsWith(`.vitepress${path.sep}`)) return

          // 自身输出的写入不触发重建（否则 dev 下死循环）；
          // 但输出文件被删除时允许重建一次，实现自愈
          if (path.basename(rel) === outName && eventName !== 'unlink') return

          regenerate(`watch:${rel}`)
          server.ws.send({ type: 'full-reload', path: reloadPath })
        }

      server.watcher.on('change', onFsChange('change'))
      server.watcher.on('add', onFsChange('add'))
      server.watcher.on('unlink', onFsChange('unlink'))
    },
  }
}
