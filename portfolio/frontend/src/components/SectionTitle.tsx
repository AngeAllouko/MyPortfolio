import BlockReveal from "./motion/BlockReveal";

/** Titre de section dévoilé par le volet jaune. */
export default function SectionTitle({
  children,
  color,
  className = "section-title",
}: {
  children: string;
  color?: string;
  className?: string;
}) {
  return (
    <BlockReveal color={color}>
      <h2 className={className}>{children}</h2>
    </BlockReveal>
  );
}
