import { Bricolage_Grotesque } from "next/font/google";

const Bricolage_Grotesque_init = Bricolage_Grotesque({
    subsets: ["latin"],
    display: "swap",
})

const fontBricolage = Bricolage_Grotesque_init.className;
export default fontBricolage;