import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AnalysisRecord } from "@/hooks/useChannelData";

interface ChannelSwitcherProps {
  channels: AnalysisRecord[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ChannelSwitcher = ({ channels, selectedId, onSelect }: ChannelSwitcherProps) => {
  if (channels.length <= 1) return null;

  return (
    <Select value={selectedId || undefined} onValueChange={onSelect}>
      <SelectTrigger className="h-9 w-auto min-w-[180px] border-0 bg-card shadow-card text-sm font-medium">
        <SelectValue placeholder="Select channel" />
      </SelectTrigger>
      <SelectContent className="bg-card">
        {channels.map((ch) => (
          <SelectItem key={ch.id} value={ch.id}>
            {ch.channel_title || ch.channel_url}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChannelSwitcher;
