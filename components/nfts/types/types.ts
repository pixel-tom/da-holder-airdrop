export type Creator = {
    address: string;
    verified: boolean;
    share: number;
  };
  
  export type PropertiesCreator = {
    address: string;
    share: number;
  };
  
  export type PropertiesFile = {
    type: string;
    uri: string;
  };
  
  export type OffChainMetadata = {
    metadata: {
      mint: string;
      uri: string;
      creators: any;
      attributes: {
        traitType: string;
        value: string;
      }[];
      description: string;
      image: string;
      name: string;
      properties: {
        category: string;
        creators: PropertiesCreator[];
        files: PropertiesFile[];
      };
      sellerFeeBasisPoints: number;
      symbol: string;
    };
    uri: string;
    error: string;
  };
  
  export type TokenMetadata = {
    id: string;
    account: string;
    onChainAccountInfo: {
      accountInfo: {
        key: string;
        isSigner: boolean;
        isWritable: boolean;
        lamports: number;
        data: {
          parsed: {
            info: {
              decimals: number;
              freezeAuthority: string;
              isInitialized: boolean;
              mintAuthority: string;
              supply: string;
            };
            type: string;
          };
          program: string;
          space: number;
        };
        owner: string;
        executable: boolean;
        rentEpoch: number;
      };
      error: string;
    };
    offChainMetadata: OffChainMetadata;
    legacyMetadata: Record<string, unknown> | null;
    selected: boolean;
  };
  