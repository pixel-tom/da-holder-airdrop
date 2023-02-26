import React, { useState } from "react";

const AirdropTokens = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [owners, setOwners] = useState<string[]>([]);

  const sendTokens = async () => {
    // TODO: Implement sending tokens to all owners
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (owners.length === 0) {
      setError("Please copy or enter owner addresses");
      return;
    }

    await sendTokens();
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Airdrop Tokens</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Sending tokens..." : "Send Tokens to All"}
        </button>
      </div>
    </div>
  );
};

export default AirdropTokens;
