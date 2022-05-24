
export type CommonUint = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256';
export type CommonInt = 'int8' | 'int16' | 'int32' | 'int64' | 'int128' | 'int256';
export type CommonBytes = 'bytes1' | 'bytes2' | 'bytes4' | 'bytes8' | 'bytes16' | 'bytes32';

export interface EIP712Type<N = string, T = string | 'string' | 'bool' | 'address' | CommonUint | CommonInt | CommonBytes> {
  name: N;
  type: T;
}

export type EIP712DomainType = (EIP712Type<'name', 'string'> | EIP712Type<'version', 'string'> | EIP712Type<'chainId', 'uint256'> | EIP712Type<'verifyingContract', 'address'> | EIP712Type<'salt', 'bytes32'>)[];

export type EIP712MessageTypesType = {
  EIP712Domain: EIP712DomainType;
  [key: string]: EIP712Type[];
};

export interface EIP712Message<T extends EIP712MessageTypesType> {
  types: T;
  domain: { name: string, version?: string, chainId?: string, verifyingContract?: string, salt?: string };
  primaryType: keyof T;
  message: any;
}