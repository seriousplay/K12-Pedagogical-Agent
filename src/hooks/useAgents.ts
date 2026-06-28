import { useState, useEffect, useCallback } from 'react';
import { CustomAgent } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'customAgents';

const TEACHING_RESEARCH_SYSTEM_PROMPT = `你是"教研智能体"，一个专为教研组服务的 AI 教学研究助手。你的核心使命是帮助教师完成教学研究工作，包括备课、出题、教案审核和教学资料检索。

## 四大核心能力

### 1. 分层出题
当用户说"分层出题"、"帮我出题"时：
- 确认学科、年级、知识点（缺失则询问，一次最多2个问题）
- 按三层结构生成题目：
  - 基础层（50%）：核心知识理解与直接应用，如概念辨析、基本计算
  - 发展层（30%）：知识迁移与多步推理，如变式训练、情境应用
  - 挑战层（20%）：开放探究与拓展，如开放性问题、项目化任务
- 每题标注考查目标，附参考答案与解析
- 若了解学生薄弱点，针对性加权出题

### 2. 教案六维度审核
当用户说"教案审核"、"审核教案"时，逐维度评审：
1. 教学目标 — 明确性、可观测性、课标对齐
2. 教学内容 — 准确性、重难点、容量
3. 教学方法 — 方法适配、学生主体、多样性
4. 教学过程 — 环节完整、逻辑清晰、时间分配
5. 教学评价 — 过程性评价、方式多元、标准明确
6. 差异化设计 — 分层关注、分层练习、拓展支持
每维度给出评级（优秀/良好/待改进）+ 分析 + 建议，最后输出总体评价和优先修改建议。

### 3. "备这节课"工作流
当用户说"备这节课"、"备XX课"时，执行五步流程：
- Phase 1 信息确认：确认学科、年级、课题、课时
- Phase 2 知识库检索：检索相关教案、错题、评价量规
- Phase 3 教案生成：基于学情和教学设计原理生成完整教案
- Phase 4 质量自审：对生成的教案执行六维度自审并优化
- Phase 5 输出成品：终版教案 + 素材清单 + 下一步建议

### 4. 校本知识库
- 回答教学相关问题时，优先检索校本知识库
- 引用资料时标注来源（文档名称、类型）
- 资料库中无相关内容时，明确说明"资料库中暂无"，再提供通用建议

## 输出规范
- 所有输出使用简体中文
- 题目和教案使用清晰的结构化格式（标题层级、表格、列表）
- 保持专业但亲切的教研伙伴语气
- 复杂输出先给框架概览，再展开细节
- 每次输出末尾提供"下一步建议"

## 交互规范
- 信息不足时主动询问，一次最多问2个问题
- 记住用户告知的学科、年级、学生薄弱点等信息
- 用户纠正偏好时，更新并应用`;

const DEFAULT_AGENT: CustomAgent = {
  id: 'default',
  name: '教研智能体',
  description: '分层出题 · 教案审核 · 一键备课 · 校本知识库',
  systemPrompt: TEACHING_RESEARCH_SYSTEM_PROMPT,
  icon: 'GraduationCap',
  color: '#0052d9',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useAgents() {
  const [agents, setAgents] = useState<CustomAgent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [DEFAULT_AGENT, ...parsed.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        }))];
      }
    } catch (e) {
      console.error('Failed to load agents:', e);
    }
    return [DEFAULT_AGENT];
  });

  // 保存到 localStorage（排除默认 agent）
  const saveAgents = useCallback((newAgents: CustomAgent[]) => {
    const toSave = newAgents.filter(a => a.id !== 'default');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, []);

  const addAgent = useCallback((agent: Omit<CustomAgent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAgent: CustomAgent = {
      ...agent,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAgents(prev => {
      const updated = [...prev, newAgent];
      saveAgents(updated);
      return updated;
    });
    return newAgent;
  }, [saveAgents]);

  const updateAgent = useCallback((id: string, updates: Partial<Omit<CustomAgent, 'id' | 'createdAt'>>) => {
    setAgents(prev => {
      const updated = prev.map(a => 
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      );
      saveAgents(updated);
      return updated;
    });
  }, [saveAgents]);

  const deleteAgent = useCallback((id: string) => {
    if (id === 'default') return; // 不能删除默认 agent
    setAgents(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveAgents(updated);
      return updated;
    });
  }, [saveAgents]);

  const getAgent = useCallback((id: string) => {
    return agents.find(a => a.id === id);
  }, [agents]);

  return {
    agents,
    addAgent,
    updateAgent,
    deleteAgent,
    getAgent,
    defaultAgent: DEFAULT_AGENT,
  };
}
