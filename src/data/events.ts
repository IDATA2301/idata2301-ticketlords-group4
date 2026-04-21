import hispanicCulturalImage from "../assets/hispanic-cultural.png";
import beachSunsetImage from "../assets/beach-sunset.png";


export type EventData = {
    slug: string;
    title: string;
    location: string;
    date: string;
    description: string;
    image?: string;
}

export const EVENTS: Record<string, EventData> = {
    "el-hispanico-festivalo": {
        slug: "el-hispanico-festivalo",
        title: "El Hispanico Festivalo",
        location: "Bergen",
        date: "2026-06-12",
        description: "A vibrant celebration of Hispanic culture",
        image: hispanicCulturalImage,
    },
    "hawaii-sunset-concert": {
        slug: "hawaii-sunset-concert",
        title: "Hawaii Sunset Concert",
        location: "Fårnebu Arena",
        date: "2026-08-12",
        description: "Live music with the sunset",
        image: beachSunsetImage,
    },

};