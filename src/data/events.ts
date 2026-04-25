
export type EventData = {
    slug: string;
    title: string;
    location: string;
    date: string;
    description: string;
    image?: string;
}

const imageModules = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,avif,svg}", {
    eager: true,
    import: "default",
}) as Record<string, string>;

const imagesByFileName: Record<string, string> = Object.fromEntries(
    Object.entries(imageModules).map(([path, url]) => [path.split("/").pop() as string, url])
);

export const EVENTS: Record<string, EventData> = {
    "el-hispanico-festivalo": {
        slug: "el-hispanico-festivalo",
        title: "El Hispanico Festivalo",
        location: "Bergen",
        date: "2026-06-12",
        description: "A vibrant celebration of Hispanic culture",
        image: imagesByFileName["hispanic-cultural.png"],
    },
    "hawaii-sunset-concert": {
        slug: "hawaii-sunset-concert",
        title: "Hawaii Sunset Concert",
        location: "Fårnebu Arena",
        date: "2026-08-12",
        description: "Live music with the sunset",
        image: imagesByFileName["beach-sunset.png"],
    },

};