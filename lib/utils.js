  import { interviewCovers, mappings } from "@/constants";
  import { clsx } from "clsx";
  import { twMerge } from "tailwind-merge"
  import { companyMappings } from "@/constants";

  /**
   * Utility to merge Tailwind classes safely
   */
  export function cn(...inputs) {
    return twMerge(clsx(inputs));
  }

  const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

  const normalizeTechName = (tech) => {
    const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
    return mappings[key];
  };

  const checkIconExists = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok; // Returns true if the icon exists
    } catch {
      return false;
    }
  };

  export const getTechLogos = async (techArray) => {
    const logoURLs = techArray.map((tech) => {
      const normalized = normalizeTechName(tech);
      return {
        tech,
        url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
      };
    });

    const results = await Promise.all(
      logoURLs.map(async ({ tech, url }) => ({
        tech,
        url: (await checkIconExists(url)) ? url : "/tech.svg",
      }))
    );

    return results;
  };

  export const getRandomInterviewCover = () => {
    const randomIndex = Math.floor(Math.random() * interviewCovers.length);
    return `/covers${interviewCovers[randomIndex]}`;
  };


const companyLogoBaseURL =
  "https://cdn.simpleicons.org"

const normalizeCompanyName = (company) => {
  const key = company
    .toLowerCase()
    .replace(/\s+/g, "")

  return companyMappings[key]
}

const checkLogoExists = async (url) => {

  try {

    const response = await fetch(url, {
      method: "HEAD",
    })

    return response.ok

  } catch {

    return false
  }
}

export const getCompanyLogo = async (company) => {

  const normalized =
    normalizeCompanyName(company)

  if (!normalized) {
    return "/company.svg"
  }

  const url =
    `${companyLogoBaseURL}/${normalized}`

  const exists = await checkLogoExists(url)

  return exists ? url : "/company.png"
}