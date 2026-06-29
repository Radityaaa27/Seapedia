import { addressRepository } from "../repositories/addressRepository";
import { AddressInput } from "../validators/addressValidator";
import { ApiError } from "../utils/ApiError";

export const addressService = {
  getAddresses: async (userId: string) => {
    return addressRepository.findAllByUser(userId);
  },

  createAddress: async (userId: string, input: AddressInput) => {
    const existing = await addressRepository.findAllByUser(userId);

    // First address is always default
    if (existing.length === 0) {
      input.isDefault = true;
    }

    return addressRepository.create(userId, input);
  },

  updateAddress: async (
    userId: string,
    addressId: string,
    input: Partial<AddressInput>
  ) => {
    const address = await addressRepository.findById(addressId, userId);
    if (!address) throw ApiError.notFound("Address not found.");
    return addressRepository.update(addressId, userId, input);
  },

  deleteAddress: async (userId: string, addressId: string) => {
    const address = await addressRepository.findById(addressId, userId);
    if (!address) throw ApiError.notFound("Address not found.");
    if (address.isDefault) {
      throw ApiError.badRequest(
        "Cannot delete your default address. Set another as default first."
      );
    }
    return addressRepository.delete(addressId);
  },

  setDefault: async (userId: string, addressId: string) => {
    const address = await addressRepository.findById(addressId, userId);
    if (!address) throw ApiError.notFound("Address not found.");
    return addressRepository.setDefault(addressId, userId);
  },
};