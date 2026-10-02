"use client";

import { createContext, useContext, useState, type ReactNode, Fragment } from "react";
import Image, { type ImageProps } from "next/image";
import { defaults, plainText, type HomeSection, type Locale, type PageKey } from "./model";
import { useHomeLocale } from "./LocaleProvider";

const ContentContext = createContext({ sections: defaults, locale: "tr" as Locale });
export function HomeContentProvider({ sections, children }: { sections: HomeSection[]; children: ReactNode }) {
  const { locale } = useHomeLocale();
  return <ContentContext.Provider value={{ sections, locale }}>{children}</ContentContext.Provider>;
}
export function useSectionContent(key: PageKey) {
  const { sections, locale } = useContext(ContentContext);
  const section = sections.find(section => section.pageKey === key)!;
  return { section, locale, text: (field: string) => plainText(section.content[locale][field]), runs: (field: string) => section.content[locale][field] };
}
export function ContentText({ section, field, svg = false }: { section: PageKey; field: string; svg?: boolean }) {
  const { runs } = useSectionContent(section);
  return runs(field).map((run, index) => {
    const style = { fontWeight: run.bold === undefined ? undefined : run.bold ? 700 : 400, fontStyle: run.italic === undefined ? undefined : run.italic ? "italic" : "normal", color: run.color, ...(svg && run.color ? {fill:run.color}: {}) };
    if (run.bold === undefined && run.italic === undefined && !run.color) return <Fragment key={index}>{run.text}</Fragment>;
    return svg ? <tspan key={index} style={style}>{run.text}</tspan> : <span key={index} style={style}>{run.text}</span>;
  });
}
export function ContentImage({ section, slot, altField, ...props }: ImageProps & { section: PageKey; slot: string; altField?: string }) {
  const { section: content, text } = useSectionContent(section);
  const external = content.media?.[slot]?.externalUrl;
  const [failed, setFailed] = useState<string | null>(null);
  return <Image {...props} alt={altField ? text(altField) : props.alt} src={external && failed !== external ? external : props.src} unoptimized={!!external || props.unoptimized} onError={() => setFailed(external || null)} />;
}
