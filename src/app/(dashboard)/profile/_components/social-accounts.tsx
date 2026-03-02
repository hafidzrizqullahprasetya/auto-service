import Link from "next/link";
import {
  DribbleIcon,
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
  XIcon,
} from "./icons";

const ACCOUNTS = [
  {
    platform: "Facebook",
    url: "#",
    Icon: FacebookIcon,
  },
  {
    platform: "X",
    url: "#",
    Icon: XIcon,
  },
  {
    platform: "LinkedIn",
    url: "#",
    Icon: LinkedInIcon,
  },
  {
    platform: "Dribble",
    url: "#",
    Icon: DribbleIcon,
  },
  {
    platform: "GitHub",
    url: "#",
    Icon: GitHubIcon,
  },
];

export function SocialAccounts() {
  return (
    <div className="mt-8 border-t border-stroke pt-6 dark:border-dark-3">
      <h4 className="mb-4 text-sm font-bold text-dark dark:text-white text-center">
        Networking & Social Channels
      </h4>
      <div className="flex items-center justify-center gap-5">
        {ACCOUNTS.map(({ Icon, ...item }) => (
          <Link
            key={item.platform}
            href={item.url}
            className="text-dark-5 hover:text-dark dark:hover:text-white transition-colors"
          >
            <span className="sr-only">View {item.platform} Account</span>

            <Icon className="size-5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
