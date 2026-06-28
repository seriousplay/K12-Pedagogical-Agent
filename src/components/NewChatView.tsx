import { Input } from 'tdesign-react';
import { FolderOpenIcon } from 'tdesign-icons-react';
import { Bot } from 'lucide-react';
import { APP_CONFIG } from '../config';
import { Model, Agent, PermissionMode } from '../types';
import { ICON_MAP } from '../utils/iconMap';

interface NewChatViewProps {
  agents: Agent[];
  models: Model[];
  selectedModel: string;
  newChatAgentId: string;
  newChatCwd: string;
  newChatPermissionMode: PermissionMode;
  onSelectModel: (modelId: string) => void;
  onSelectAgent: (agentId: string) => void;
  onSetCwd: (cwd: string) => void;
  onSetPermissionMode: (mode: PermissionMode) => void;
  onQuickStart?: (prompt: string) => void;
}

const QUICK_STARTS = [
  { icon: 'FileText', label: '备这节课', prompt: '备这节课 — ', color: '#534AB7' },
  { icon: 'ListChecks', label: '分层出题', prompt: '帮我出题 — ', color: '#0F6E56' },
  { icon: 'ClipboardCheck', label: '教案审核', prompt: '帮我审核这个教案：\n\n', color: '#854F0B' },
  { icon: 'Search', label: '知识库检索', prompt: '', color: '#185FA5' },
];

export function NewChatView({
  agents,
  newChatAgentId,
  newChatCwd,
  onSelectAgent,
  onSetCwd,
  onSetPermissionMode,
  onQuickStart,
}: NewChatViewProps) {
  const selectedAgent = agents.find(a => a.id === newChatAgentId);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-lg">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto"
            style={{ 
              background: 'linear-gradient(135deg, var(--td-brand-color), var(--td-brand-color-hover))'
            }}
          >
            <span className="text-3xl font-bold text-white">{APP_CONFIG.nameInitial}</span>
          </div>
          <h2 
            className="text-2xl font-semibold mb-2"
            style={{ color: 'var(--td-text-color-primary)' }}
          >
            {APP_CONFIG.name}
          </h2>
          <p style={{ color: 'var(--td-text-color-secondary)' }}>
            {APP_CONFIG.description}
          </p>
        </div>

        {/* 快捷入口 */}
        {onQuickStart && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--td-text-color-primary)' }}>
              快捷功能
            </label>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_STARTS.map((qs) => {
                const Icon = ICON_MAP[qs.icon] || Bot;
                return (
                  <div
                    key={qs.label}
                    className="p-3 rounded-xl cursor-pointer transition-all border-2 hover:shadow-md"
                    style={{
                      borderColor: 'transparent',
                      backgroundColor: 'var(--td-bg-color-component)',
                    }}
                    onClick={() => onQuickStart(qs.prompt)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: qs.color }}
                      >
                        <Icon size={18} color="white" />
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--td-text-color-primary)' }}>
                        {qs.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Agent 选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--td-text-color-primary)' }}>
            选择 Agent
          </label>
          <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
            {agents.map(agent => {
              const AgentIcon = ICON_MAP[agent.icon || 'Bot'] || Bot;
              const isSelected = agent.id === newChatAgentId;
              return (
                <div
                  key={agent.id}
                  className="p-3 rounded-xl cursor-pointer transition-all border-2"
                  style={{
                    borderColor: isSelected ? (agent.color || 'var(--td-brand-color)') : 'transparent',
                    backgroundColor: isSelected ? 'var(--td-brand-color-light)' : 'var(--td-bg-color-component)',
                  }}
                  onClick={() => {
                    onSelectAgent(agent.id);
                    if (agent.permissionMode) {
                      onSetPermissionMode(agent.permissionMode);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: agent.color || '#0052d9' }}
                    >
                      <AgentIcon size={20} color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--td-text-color-primary)' }}>
                        {agent.name}
                      </div>
                      {agent.description && (
                        <div className="text-xs truncate mt-0.5" style={{ color: 'var(--td-text-color-placeholder)' }}>
                          {agent.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 工作目录 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--td-text-color-primary)' }}>
            工作目录 <span style={{ color: 'var(--td-text-color-placeholder)' }}>(可选)</span>
          </label>
          <Input
            value={newChatCwd}
            onChange={(v) => onSetCwd(v as string)}
            placeholder="例如：/Users/username/projects/my-app"
            prefixIcon={<FolderOpenIcon />}
          />
          <p className="text-xs mt-1.5" style={{ color: 'var(--td-text-color-placeholder)' }}>
            指定 Agent 的工作目录，用于文件操作等
          </p>
        </div>

        {/* 选中的 Agent 预览 */}
        {selectedAgent && (
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--td-bg-color-component)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const Icon = ICON_MAP[selectedAgent.icon || 'Bot'] || Bot;
                return (
                  <>
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: selectedAgent.color || '#0052d9' }}
                    >
                      <Icon size={14} color="white" />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--td-text-color-primary)' }}>
                      {selectedAgent.name}
                    </span>
                  </>
                );
              })()}
            </div>
            <p className="text-xs line-clamp-2" style={{ color: 'var(--td-text-color-secondary)' }}>
              {selectedAgent.systemPrompt}
            </p>
          </div>
        )}
        
        {/* 提示文字 */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--td-text-color-placeholder)' }}>
          点击快捷功能或直接输入问题开始对话
        </p>
      </div>
    </div>
  );
}
