
import { facilityService } from './facilities/facilityService';
import { associationService } from './facilities/associationService';

// Re-export all services from a single entry point for backward compatibility
export class HealthFacilitiesService {
  // Facility management methods
  async createFacility(facilityData: any) {
    return facilityService.createFacility(facilityData);
  }

  async getUserFacilities() {
    return facilityService.getUserFacilities();
  }

  async getFacilityById(facilityId: string) {
    return facilityService.getFacilityById(facilityId);
  }

  async updateFacility(facilityId: string, updates: any) {
    return facilityService.updateFacility(facilityId, updates);
  }

  async checkFacilityAccess(facilityId: string, requiredType?: string) {
    return facilityService.checkFacilityAccess(facilityId, requiredType);
  }

  // Association management methods
  async requestFacilityAssociation(facilityId: string, notes?: string) {
    return associationService.requestFacilityAssociation(facilityId, notes);
  }

  async getUserAssociations() {
    return associationService.getUserAssociations();
  }

  async updateAssociationStatus(associationId: string, status: 'approved' | 'rejected', notes?: string) {
    return associationService.updateAssociationStatus(associationId, status, notes);
  }

  async getPendingAssociations() {
    return associationService.getPendingAssociations();
  }
}

export const healthFacilitiesService = new HealthFacilitiesService();

// Also export individual services for direct use
export { facilityService } from './facilities/facilityService';
export { associationService } from './facilities/associationService';
