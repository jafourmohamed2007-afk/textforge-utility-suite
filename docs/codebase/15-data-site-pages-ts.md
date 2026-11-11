# 15. `data/site-pages.ts`

About, Contact, Privacy, Terms and Disclaimer text.

```ts
import type { ContentSection } from "../lib/types";

/**
 * Trust and policy pages. Text is generated from a few settings so the
 * privacy policy always matches what the site really does: with
 * NEXT_PUBLIC_ADSENSE_CLIENT unset there are no ads or cookies, and with it
 * set the Google advertising disclosures AdSense requires are included.
 */

export interface SitePageSettings {
  siteName: string;
  fullName: string;
  siteUrl: string;
  contactEmail: string;
  owner: string | null;
  adsEnabled: boolean;
  updated: string;
}

export interface SitePage {
  slug: "about" | "contact" | "privacy-policy" | "terms" | "disclaimer";
  title: string;
  description: string;
  /** schema.org page type. */
  schemaType: "AboutPage" | "ContactPage" | "WebPage";
  sections: readonly ContentSection[];
}

export function buildSitePages(s: SitePageSettings): readonly SitePage[] {
  const runBy = s.owner ? `${s.siteName} is run by ${s.owner}.` : `${s.siteName} is an independent project with no ties to any government or exam board.`;

  const about: SitePage = {
    slug: "about",
    title: `About ${s.siteName}`,
    description: `Who makes ${s.fullName}, why it exists, how it works and how we test it.`,
    schemaType: "AboutPage",
    sections: [
      {
        heading: "Why FitKB exists",
        blocks: [
          {
            type: "p",
            text: `Millions of people every year have to upload a photo or signature to an online form: exam registrations, job applications, passport and visa services, university admissions. Almost all of those forms set a strict file size limit, such as 20 KB or 50 KB, while phone cameras produce photos of several megabytes. ${s.siteName} was built to close that gap in a few seconds, on the phone people are already using, without sending private photos to a stranger's server.`,
          },
          { type: "p", text: runBy },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          {
            type: "p",
            text: "When you choose a photo, your browser decodes it, applies the rotation stored by the camera, and draws it onto a canvas at the size you chose. It then encodes the canvas as a JPEG several times, searching for the highest quality that is still at or under your limit. Only when quality alone cannot reach the limit does it reduce the pixel dimensions, and then only as far as needed.",
          },
          {
            type: "p",
            text: "Limits are applied as KB × 1000 bytes so that results pass forms that count 1 KB as 1000 bytes and forms that count it as 1024. The method is explained in plain language in our [guides](/guides), starting with [how to compress a photo to an exact KB size](/guides/how-to-compress-image-to-exact-kb).",
          },
        ],
      },
      {
        heading: "Privacy by design",
        blocks: [
          {
            type: "p",
            text: "Photos never leave your device. There is no upload step, no account and no photo storage, and the result is created from pixels only, so location and camera data stored in the original file is not copied. Details are in the [privacy policy](/privacy-policy).",
          },
        ],
      },
      {
        heading: "How we test and review",
        blocks: [
          {
            type: "ul",
            items: [
              "The size search and the crop calculations are covered by automated tests that run on every change.",
              "Every preset is checked in a real browser with full-size phone photos to confirm the result is under the limit.",
              "Pages are checked on small phone screens for readable text, large tap targets and no layout jumping.",
              "Each tool and guide shows the date it was last reviewed. Facts that depend on a country or form point to the official source.",
            ],
          },
        ],
      },
      {
        heading: "What FitKB does not do",
        blocks: [
          {
            type: "p",
            text: "FitKB resizes, crops and compresses. It does not judge whether a photo meets passport or visa rules such as head size, background colour or expression, and it is not affiliated with any authority. Always follow the instructions of the organisation you are applying to. See the [disclaimer](/disclaimer).",
          },
        ],
      },
      {
        heading: "Get in touch",
        blocks: [
          {
            type: "p",
            text: "Found a form that FitKB cannot satisfy, a mistake in a guide, or a preset you would like added? Visit the [contact page](/contact). Suggestions from users decide which presets we add next.",
          },
        ],
      },
    ],
  };

  const contact: SitePage = {
    slug: "contact",
    title: "Contact",
    description: `How to contact ${s.fullName} with questions, corrections or preset requests.`,
    schemaType: "ContactPage",
    sections: [
      {
        heading: "Email",
        blocks: [
          {
            type: "p",
            text: `Write to ${s.contactEmail}. We read every message and aim to answer every question and correction request.`,
          },
        ],
      },
      {
        heading: "Helpful details to include",
        blocks: [
          {
            type: "ul",
            items: [
              "The page you were using, for example the 20 KB preset or a guide.",
              "The phone or computer and browser, for example Android with Chrome or iPhone with Safari.",
              "For size problems, the limit you set and the size and dimensions of the original photo.",
              "For preset requests, the size, dimensions and format the form asks for, and a link to its official instructions if public.",
            ],
          },
          {
            type: "note",
            text: "Please do not email us your photos, signatures or ID documents. We never need them to help, because the tool runs entirely on your device.",
          },
        ],
      },
      {
        heading: "Before you write",
        blocks: [
          {
            type: "p",
            text: "Many common questions are answered in the [FAQ](/faq) and the [guides](/guides), including [why forms reject photos](/guides/why-is-my-photo-rejected-online-form).",
          },
        ],
      },
    ],
  };

  const adSections: ContentSection[] = s.adsEnabled
    ? [
        {
          heading: "Advertising and cookies",
          blocks: [
            {
              type: "p",
              text: `${s.siteName} is free because it shows ads served by Google AdSense. Ads are shown on our pages, never inside your photos, and advertisers never receive your photos.`,
            },
            {
              type: "ul",
              items: [
                "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.",
                "Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet.",
                "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com). You can also opt out of some third-party vendors' use of cookies for personalised advertising at [aboutads.info](https://www.aboutads.info/choices).",
                "Google explains [how it uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).",
              ],
            },
            {
              type: "p",
              text: "Visitors in the European Economic Area, the United Kingdom and Switzerland are asked for consent through a Google-certified consent message before personalised ads or advertising cookies are used. You can change your choice at any time through the privacy and cookie settings link shown by that message.",
            },
          ],
        },
      ]
    : [
        {
          heading: "Advertising and cookies",
          blocks: [
            {
              type: "p",
              text: `${s.siteName} currently shows no ads and sets no cookies. If that changes, this policy will be updated before any advertising or cookies are introduced, and the date at the top of this page will change.`,
            },
          ],
        },
      ];

  const privacy: SitePage = {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: `How ${s.fullName} handles your photos and data: photos are processed on your device and never uploaded.`,
    schemaType: "WebPage",
    sections: [
      {
        heading: "Summary",
        blocks: [
          {
            type: "note",
            text: "Your photos are processed entirely in your browser. They are never uploaded to our servers, and we cannot see, store or share them.",
          },
          {
            type: "p",
            text: `This policy applies to ${s.siteUrl} and explains what information is involved when you use ${s.fullName}, and the choices you have.`,
          },
        ],
      },
      {
        heading: "Your photos",
        blocks: [
          {
            type: "p",
            text: "When you choose, drop or paste a photo, it is opened by your own browser. Resizing, cropping and compression happen on your device, and the result is saved directly to your device when you download it. No copy is sent to us or to anyone else. Closing or reloading the page discards the photo from memory.",
          },
          {
            type: "p",
            text: "The new file is drawn from pixels only, so metadata in the original, such as GPS location, camera model and the date the photo was taken, is not included.",
          },
        ],
      },
      {
        heading: "Information collected automatically",
        blocks: [
          {
            type: "p",
            text: "Like any website, our hosting provider receives technical information needed to deliver pages, such as your IP address, browser type, the page requested and the time of the request. This information is used to operate and secure the site and is kept only as long as needed for those purposes. We do not use it to identify you.",
          },
        ],
      },
      ...adSections,
      {
        heading: "Information you send us",
        blocks: [
          {
            type: "p",
            text: `If you email ${s.contactEmail}, we receive your email address and message and use them only to reply. We do not add you to mailing lists or sell your details.`,
          },
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          {
            type: "p",
            text: "Depending on where you live, laws such as the GDPR or the California Consumer Privacy Act give you rights to access, correct or delete personal information and to object to certain processing. Because we do not receive your photos and do not run accounts, we hold very little about you. To make a request, contact us using the details below.",
          },
        ],
      },
      {
        heading: "Children",
        blocks: [
          {
            type: "p",
            text: "The site is a general-purpose tool and is not directed at children under 13. We do not knowingly collect personal information from children.",
          },
        ],
      },
      {
        heading: "Changes and contact",
        blocks: [
          {
            type: "p",
            text: `We will update this page if our practices change and show the new date at the top. Questions about privacy can be sent to ${s.contactEmail} or through the [contact page](/contact).`,
          },
        ],
      },
    ],
  };

  const terms: SitePage = {
    slug: "terms",
    title: "Terms of Use",
    description: `The terms that apply when you use ${s.fullName}.`,
    schemaType: "WebPage",
    sections: [
      {
        heading: "Using the site",
        blocks: [
          {
            type: "p",
            text: `By using ${s.siteUrl} you agree to these terms. ${s.fullName} is provided free of charge for personal and commercial use. You may not use it to process images you do not have the right to use, or to attempt to disrupt or overload the site.`,
          },
        ],
      },
      {
        heading: "Your content",
        blocks: [
          {
            type: "p",
            text: "Your photos stay on your device and remain yours. We claim no rights over images you process, and we never receive them.",
          },
        ],
      },
      {
        heading: "No guarantee of acceptance",
        blocks: [
          {
            type: "p",
            text: "We work to make results meet the size and dimensions you set, but we cannot guarantee that any authority, employer, institution or website will accept a particular file. You are responsible for checking requirements and the final file before submitting it. See the [disclaimer](/disclaimer).",
          },
        ],
      },
      {
        heading: "The service is provided as is",
        blocks: [
          {
            type: "p",
            text: "The site is provided without warranties of any kind, express or implied, including fitness for a particular purpose. To the maximum extent permitted by law, we are not liable for any loss arising from use of the site, including rejected applications, missed deadlines or lost files. Keep a copy of your original photos.",
          },
        ],
      },
      {
        heading: "Third-party links and services",
        blocks: [
          {
            type: "p",
            text: s.adsEnabled
              ? "Pages may contain ads and links to other websites. We do not control and are not responsible for their content or practices."
              : "Pages may contain links to other websites. We do not control and are not responsible for their content or practices.",
          },
        ],
      },
      {
        heading: "Changes",
        blocks: [
          {
            type: "p",
            text: `We may update these terms and will show the new date at the top of this page. Questions can be sent to ${s.contactEmail}.`,
          },
        ],
      },
    ],
  };

  const disclaimer: SitePage = {
    slug: "disclaimer",
    title: "Disclaimer",
    description: `${s.fullName} is an independent tool and is not affiliated with any government, passport office, embassy or exam board.`,
    schemaType: "WebPage",
    sections: [
      {
        heading: "Not an official service",
        blocks: [
          {
            type: "p",
            text: `${s.fullName} is independent. It is not affiliated with, endorsed by or connected to any government, passport or visa office, embassy, exam board, university or employer. Names of documents and photo sizes are used only to describe what a preset produces.`,
          },
        ],
      },
      {
        heading: "Photo rules are set by each authority",
        blocks: [
          {
            type: "p",
            text: "Passport, visa and application photo requirements differ between countries and organisations and change over time. Our presets set dimensions and file size; they do not check head size, background, lighting, expression or any other biometric rule. Always read and follow the official instructions of the organisation you are applying to.",
          },
        ],
      },
      {
        heading: "Guides are general information",
        blocks: [
          {
            type: "p",
            text: "Our [guides](/guides) explain how image sizes and formats work in general. Examples of sizes used by particular countries or forms are given for illustration and may not reflect the latest official rules. If anything in a guide differs from official instructions, the official instructions apply. Please [tell us](/contact) about errors so we can correct them.",
          },
        ],
      },
      {
        heading: "Advertising",
        blocks: [
          {
            type: "p",
            text: s.adsEnabled
              ? "Ads on this site are served by Google and are clearly labelled. An ad does not mean we recommend the product or service shown."
              : "The site shows no ads at present.",
          },
        ],
      },
    ],
  };

  return [about, contact, privacy, terms, disclaimer];
}
```
