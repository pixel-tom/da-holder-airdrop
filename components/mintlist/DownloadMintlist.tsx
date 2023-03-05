import React from "react";

type DownloadMintlistProps = {
  fileUrl: string | undefined;
};

const DownloadMintlist = ({ fileUrl }: DownloadMintlistProps) => {
  return (
    <div className="flex flex-row items-center justify-between my-3">
      <div className="flex-1">
        <a
          href={fileUrl || ""}
          download="mintlist.json"
          className={`${
            fileUrl ? "block" : "hidden"
          } flex bg-slate-600 w-full text-gray-200 font-medium text-center border border-gray-400 px-4 py-2 rounded-md hover:bg-slate-500 hover:drop-shadow focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <p>Download Mintlist</p>
        </a>
      </div>
    </div>
  );
};

export default DownloadMintlist;
