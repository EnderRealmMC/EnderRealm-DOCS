import fs from 'fs'
import path from 'path'

interface TreeNode {
  name: string
  path: string | undefined
  isDirectory: boolean
  children: TreeNode[]
}

/**
 * 扫描目录生成树结构
 */
function scanDirectory(dirPath: string, basePath: string = '', isRoot: boolean = false): TreeNode[] {
  const items: TreeNode[] = []
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      // 跳过隐藏文件、node_modules、.vitepress 等
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === '.vitepress' ||
          entry.name === 'dist' ||
          entry.name === 'cache' ||
          entry.name === '目录.md' ||
          entry.name === 'package.json' ||
          entry.name === 'package-lock.json') {
        continue
      }
      
      const fullPath = path.join(dirPath, entry.name)
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name
      
      if (entry.isDirectory()) {
        // 扫描子目录
        const children = scanDirectory(fullPath, relativePath, false)
        
        // 只有当目录有内容时才添加（避免空目录）
        if (children.length > 0) {
          const indexPath = path.join(fullPath, 'index.md')
          const hasIndex = fs.existsSync(indexPath)
          
          items.push({
            name: entry.name,
            path: hasIndex ? `/${relativePath}/` : undefined,
            isDirectory: true,
            children
          })
        }
      } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
        // 只处理 .md 文件，排除 index.md
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
  
  return items
}

/**
 * 生成 HTML 树状结构
 */
function generateHtmlTree(nodes: TreeNode[], level: number = 0): string {
  let result = ''
  
  nodes.forEach((node, index) => {
    const isLastItem = index === nodes.length - 1
    const indent = '  '.repeat(level)
    const connector = isLastItem ? '└── ' : '├── '
    
    if (node.isDirectory) {
      // 目录节点：如果有路径则生成链接，否则只显示名称
      const display = node.path 
        ? `<a href="${node.path}">${node.name}</a>` 
        : node.name
      result += `${indent}${connector}${display}\n`
      result += generateHtmlTree(node.children, level + 1)
    } else {
      // 文件节点
      const link = `<a href="${node.path}">${node.name}</a>`
      result += `${indent}${connector}${link}\n`
    }
  })
  
  return result
}

/**
 * 生成目录文件
 */
export function generateDirectory(rootDir: string, outputFile: string) {
  console.log('Generating directory...')
  
  const tree = scanDirectory(rootDir, '', true)
  const htmlTree = generateHtmlTree(tree)
  
  const content = `---
editLink: false
---

# 文档目录
::: tip
本页面由系统自动生成，无需自行维护
:::
<pre>
${htmlTree}
</pre>
`
  
  fs.writeFileSync(outputFile, content, 'utf-8')
  console.log(`Directory generated: ${outputFile}`)
}

/**
 * VitePress 插件
 */
export function directoryPlugin(rootDir: string, outputFile: string) {
  return {
    name: 'vitepress-directory-generator',
    buildStart() {
      generateDirectory(rootDir, outputFile)
    }
  }
}
