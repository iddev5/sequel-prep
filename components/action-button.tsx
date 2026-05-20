import Link from "next/link";

export default function ActionButton({ href, text, children }) {
  return (<Link href={href} className="bg-indigo-400 p-1 px-3 rounded-lg hover:bg-indigo-500 flex justify-center items-center gap-1">
    <p>{text}</p>
    {children}
  </Link>);
}
