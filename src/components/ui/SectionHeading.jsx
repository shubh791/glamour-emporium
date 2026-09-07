import { cn } from "@/lib/utils";

export default function SectionHeading({ eyebrow, title, description, align = "left", className = "", titleAs: TitleTag = "h2", id }) {
  return (
    <div className={cn("section-heading", align === "center" && "section-heading--center", className)} data-reveal>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <TitleTag id={id} className="display section-title">{title}</TitleTag>}
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
