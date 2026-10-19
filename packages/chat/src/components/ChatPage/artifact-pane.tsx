import { ArtifactPanel } from "../ArtifactPanel/index.js";
import type { ChatPageArtifact } from "../ArtifactPanel/artifact.js";
import type { ChatPageProps } from "./types.js";

export type ArtifactPaneProps = Pick<
  ChatPageProps,
  | "artifactTitle"
  | "artifactEmptyText"
  | "activeArtifactId"
  | "onSelectArtifact"
  | "safeRegistry"
  | "user"
  | "artifactViewers"
  | "onDownloadArtifact"
> & {
  /** 当前产物（缺省时面板展示空态） */
  artifact?: ChatPageArtifact;
  /** 会话内全部产物 */
  artifacts: ChatPageArtifact[];
  /** 关闭产物区 */
  onClose: () => void;
};

/** 最右产物区：ArtifactPanel 外框（左边框 + 弱底色），关闭事件回到组合层 */
export function ArtifactPane({
  artifact,
  artifacts,
  activeArtifactId,
  artifactTitle,
  artifactEmptyText,
  safeRegistry,
  user,
  artifactViewers,
  onSelectArtifact,
  onDownloadArtifact,
  onClose,
}: ArtifactPaneProps) {
  return (
    <div
      data-slot="chat-page-artifact"
      className="flex h-full min-w-0 flex-col border-l border-border bg-muted"
    >
      <ArtifactPanel
        artifact={artifact}
        artifacts={artifacts}
        activeArtifactId={activeArtifactId}
        title={artifactTitle}
        emptyText={artifactEmptyText}
        safeRegistry={safeRegistry}
        user={user}
        artifactViewers={artifactViewers}
        onSelectArtifact={(id) => onSelectArtifact?.(id)}
        onDownload={onDownloadArtifact}
        onClose={onClose}
      />
    </div>
  );
}
