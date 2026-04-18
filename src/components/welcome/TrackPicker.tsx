/**
 * TrackPicker — lets the user choose their initial learning track on the
 * WelcomePage.
 *
 * Supported track IDs match the tracks defined in the curriculum domain
 * model: "python-fundamentals" and "devops".
 */

import { useTranslation } from "react-i18next";
import { Code2, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type WelcomeTrackId = "python-fundamentals" | "devops";

interface TrackOption {
  id: WelcomeTrackId;
  icon: React.ReactNode;
  nameKey: string;
  descriptionKey: string;
}

const TRACKS: TrackOption[] = [
  {
    id: "python-fundamentals",
    icon: <Code2 className="h-6 w-6" aria-hidden="true" />,
    nameKey: "welcome.trackPicker.python.name",
    descriptionKey: "welcome.trackPicker.python.description",
  },
  {
    id: "devops",
    icon: <Server className="h-6 w-6" aria-hidden="true" />,
    nameKey: "welcome.trackPicker.devops.name",
    descriptionKey: "welcome.trackPicker.devops.description",
  },
];

interface TrackPickerProps {
  /** Called with the chosen track ID when the user confirms their selection. */
  onSelect: (trackId: WelcomeTrackId) => void;
  /** Disable interaction while saving. */
  disabled?: boolean;
}

export function TrackPicker({ onSelect, disabled = false }: TrackPickerProps) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="track-picker-heading">
      <h2
        id="track-picker-heading"
        className="mb-6 text-center text-xl font-semibold text-foreground"
      >
        {t("welcome.trackPicker.heading")}
      </h2>

      <ul
        role="list"
        className="flex flex-col gap-4 sm:flex-row sm:justify-center"
      >
        {TRACKS.map((track) => (
          <li key={track.id}>
            <Card
              className={cn(
                "w-full sm:w-72 transition-shadow",
                disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md",
              )}
            >
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <span className="text-primary">{track.icon}</span>
                  <span className="text-lg font-semibold text-foreground">
                    {t(track.nameKey)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {t(track.descriptionKey)}
                </p>

                <Button
                  className="mt-2 w-full"
                  onClick={() => onSelect(track.id)}
                  disabled={disabled}
                  aria-label={`${t("welcome.trackPicker.select")}: ${t(track.nameKey)}`}
                >
                  {t("welcome.trackPicker.select")}
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
