import Image from "next/image";
import type { StaticImageData } from "next/image";

import { cn } from "@/lib/cn";

import styles from "./media-card.module.css";

interface MediaCardProps {
  image: StaticImageData;
  alt: string;
  kicker: string;
  title: string;
  description: string;
  sizes: string;
  partner?: boolean;
}

export function MediaCard({
  image,
  alt,
  kicker,
  title,
  description,
  sizes,
  partner = false,
}: MediaCardProps) {
  return (
    <article className={cn(styles.card, partner && styles.partner)}>
      <div className={styles.media}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          quality={82}
        />
      </div>
      <div className={styles.body}>
        <p className={styles.kicker}>{kicker}</p>
        <h3>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
