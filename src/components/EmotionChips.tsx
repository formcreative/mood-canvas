import type { Emotion } from "../data/emotions";

interface EmotionChipsProps {
  emotions: Emotion[];
  selectedId: Emotion["id"];
  onSelect: (emotion: Emotion) => void;
}

export function EmotionChips({ emotions, selectedId, onSelect }: EmotionChipsProps) {
  return (
    <div className="emotion-chips" aria-label="Choose an emotion" role="group">
      {emotions.map((emotion) => (
        <button
          aria-pressed={emotion.id === selectedId}
          aria-label={`Choose ${emotion.label}`}
          className="emotion-chip"
          key={emotion.id}
          onClick={() => onSelect(emotion)}
          style={
            emotion.id === selectedId
              ? {
                  borderColor: emotion.accentColor,
                  backgroundColor: `${emotion.accentColor}26`,
                  color: emotion.textColor,
                }
              : undefined
          }
          type="button"
        >
          {emotion.label}
        </button>
      ))}
    </div>
  );
}
