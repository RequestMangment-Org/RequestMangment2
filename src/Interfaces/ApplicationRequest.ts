export interface ApplicationRequest  {
  id?: number;
  fullName: string;
  birthDate: Date;
  phoneNumber: string;
  isInClub: boolean;
  clubName?: string | null;
  hasSchengenVisa: boolean;
  visaFilePath?: string | null;
  hasParentApproval: boolean;
  approvalFilePath?: string | null;
  submissionDate?: Date;
}
