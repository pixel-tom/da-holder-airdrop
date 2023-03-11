import React from "react";

interface CreatorInputProps {
  handleButtonClick: (creator: string) => Promise<void>;
  isLoading: boolean;
}

const CreatorInput = ({ handleButtonClick, isLoading }: CreatorInputProps) => {
  const [creator, setCreator] = React.useState("");

  const handleCreatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreator(event.target.value);
  };

  

  return (
    <div className="flex flex-col mb-4 text-gray-200">
      
      <label htmlFor="creator" className="font-medium mb-2">
        Enter CandyMachine ID/First Creator Address:
      </label>
      <div className="flex flex-row h-12">
        <input
          className="w-3/5 h-auto py-2 px-4 bg-gray-700 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Creator Address.."
          type="text"
          id="creator"
          value={creator}
          onChange={handleCreatorChange}
        />
        <div className="flex flex-grow w-12/5 rounded-xl ml-2 mx-auto bg-gradient-to-r p-[3px] from-[#6EE7B7] to-[#3B82F6]">
          <button
            className="w-full h-auto bg-slate-600 px-4 py-2  text-gray-200 font-medium rounded-lg hover:bg-slate-500 focus:outline-none flex items-center justify-center"
            onClick={() => handleButtonClick(creator)} // <-- pass the creator value as an argument
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-b-0 border-gray-400 rounded-full animate-spin"></div>
                <span className="ml-3">Loading...</span>
              </div>
            ) : (
              "Generate Mintlist"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorInput;
