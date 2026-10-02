/**
 * 首页快速索引的数据定义：视图（HomeQuickIndex.vue）只负责渲染，
 * 增删卡片、调整链接都在这里改。
 */
import type { Component } from 'vue'
import { FileText, Newspaper, Gamepad2, ListTree, Pickaxe, Code } from 'lucide-vue-next'

export interface HomeLink {
	text: string
	href: string
}

export interface HomeCardData {
	title: string
	href: string
	desc?: string
	links?: HomeLink[]
	icon?: Component
	/** 在双列网格中横跨两列 */
	wide?: boolean
}

/** 快速索引：官方规则类文档，逐篇列出 */
export const quickIndexCards: HomeCardData[] = [
	{
		title: '协议与政策',
		href: '/官方文档/协议与政策/',
		icon: FileText,
		wide: true,
		links: [
			{ text: 'EnderRealm 基本章程', href: '/官方文档/协议与政策/EnderRealm基本章程' },
			{ text: 'EnderRealm 玩家守则', href: '/官方文档/协议与政策/EnderRealm玩家守则' },
			{ text: 'EnderRealm 用户协议', href: '/官方文档/协议与政策/EnderRealm用户协议' },
			{ text: 'EnderRealm 隐私政策', href: '/官方文档/协议与政策/EnderRealm隐私政策' }
		]
	},
	{
		title: '公示名单',
		href: '/官方文档/公示名单/',
		icon: Newspaper,
		links: [{ text: 'EnderRealm 内务黑名单', href: '/官方文档/公示名单/EnderRealm内务黑名单' }]
	}
]

/** 参与我们：原 hero 按钮的入口并入这里 */
export const joinCards: HomeCardData[] = [
	{
		title: '文档目录',
		href: '/目录',
		icon: ListTree,
		desc: '浏览全部文档的树状目录'
	},
	{
		title: '贡献指南',
		href: '/CONTRIBUTING',
		icon: Pickaxe,
		desc: '了解如何参与文档的编写与修订'
	},
	{
		title: 'GitHub 仓库',
		href: 'https://github.com/EnderRealmMC/EnderRealm-DOCS',
		icon: Code,
		desc: '提交 Issue 或 Pull Request'
	}
]

/** 社区文档：玩法图鉴（整行卡片） */
export const communityCard: HomeCardData = {
	title: '玩法图鉴',
	href: '/玩法图鉴/',
	icon: Gamepad2,
	desc: 'EnderRealm 各项玩法与游戏模式的介绍，由社区共同维护',
	links: [{ text: '历史旧玩法', href: '/玩法图鉴/历史旧玩法/' }]
}

/** 社区文档：圣经（页面最底部的收尾区块，只给分类入口） */
export const bibleBlock = {
	kicker: '圣经',
	title: '由玩家自行编写的抽象文案',
	href: '/圣经/',
	desc: '前往「圣经」分类查看全部内容'
}
