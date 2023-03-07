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
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="my-auto ml-auto mr-2"
              viewBox="0 -1 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
            </svg>

          <p className="mr-auto">Download</p>
        </a>
      </div>
    </div>
  );
};

export default DownloadMintlist;
