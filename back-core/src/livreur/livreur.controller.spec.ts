import { Test, TestingModule } from '@nestjs/testing';
import { LivreurController } from './livreur.controller';
import { LivreurService } from './livreur.service';
import { CommandeType } from './enums/commande-type.enum';
import { BadRequestException } from '@nestjs/common';

// Mock du LivreurService
const mockLivreurService = {
  updateCommandeStatut: jest.fn(),
};

describe('LivreurController', () => {
  let controller: LivreurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivreurController],
      providers: [
        {
          provide: LivreurService,
          useValue: mockLivreurService,
        },
      ],
    }).compile();

    controller = module.get<LivreurController>(LivreurController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateCommandeStatut', () => {
    const commandeId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const type = CommandeType.INDIVIDUELLE;
    const statutId = 5;

    it('should call livreurService.updateCommandeStatut with correct parameters and return result', async () => {
      // Arrange
      const expectedResult = { statutId };
      mockLivreurService.updateCommandeStatut.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.updateCommandeStatut(commandeId, type, { statutId });

      // Assert
      expect(mockLivreurService.updateCommandeStatut).toHaveBeenCalledWith(commandeId, type, statutId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException if type is missing', async () => {
      // Act & Assert
      await expect(
        controller.updateCommandeStatut(commandeId, undefined as any, { statutId })
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.updateCommandeStatut(commandeId, undefined as any, { statutId })
      ).rejects.toThrow("Le paramètre de requête 'type' est manquant ou invalide.");
    });

    it('should throw BadRequestException if type is invalid', async () => {
      // Act & Assert
      await expect(
        controller.updateCommandeStatut(commandeId, 'INVALID_TYPE' as any, { statutId })
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.updateCommandeStatut(commandeId, 'INVALID_TYPE' as any, { statutId })
      ).rejects.toThrow("Le paramètre de requête 'type' est manquant ou invalide.");
    });

    it('should throw BadRequestException if statutId is missing', async () => {
      // Act & Assert
      await expect(
        controller.updateCommandeStatut(commandeId, type, {} as any)
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.updateCommandeStatut(commandeId, type, {} as any)
      ).rejects.toThrow("La propriété 'statutId' est manquante ou n'est pas un nombre.");
    });

    it('should throw BadRequestException if statutId is not a number', async () => {
      // Act & Assert
      await expect(
        controller.updateCommandeStatut(commandeId, type, { statutId: 'not-a-number' } as any)
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.updateCommandeStatut(commandeId, type, { statutId: 'not-a-number' } as any)
      ).rejects.toThrow("La propriété 'statutId' est manquante ou n'est pas un nombre.");
    });

    it('should throw error if livreurService throws an error', async () => {
      // Arrange
      const errorMessage = 'Erreur dans le service';
      mockLivreurService.updateCommandeStatut.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(
        controller.updateCommandeStatut(commandeId, type, { statutId })
      ).rejects.toThrow(errorMessage);
    });
  });
});