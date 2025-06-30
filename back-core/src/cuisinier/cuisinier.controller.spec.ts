import { Test, TestingModule } from '@nestjs/testing';
import { CuisinierController } from './cuisinier.controller';
import { CuisinierService } from './cuisinier.service';
import { Recettes } from '../entities/Recettes';

// On crée une fausse implémentation (un mock) du CuisinierService
const mockCuisinierService = {
  findAllRecettes: jest.fn(), // jest.fn() crée une fonction simulée
  // On pourrait ajouter d'autres méthodes si on les testait aussi
  // findCommandeStatus: jest.fn(), 
};

describe('CuisinierController', () => {
  let controller: CuisinierController;
  let service: CuisinierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuisinierController],
      providers: [
        {
          provide: CuisinierService,
          useValue: mockCuisinierService, // On dit à NestJS d'utiliser notre mock au lieu du vrai service
        },
      ],
    }).compile();

    controller = module.get<CuisinierController>(CuisinierController);
    service = module.get<CuisinierService>(CuisinierService);
  });
  
  // Toujours nettoyer les mocks après chaque test
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test spécifique pour notre nouvelle route
  describe('findAllRecettes', () => {
    it('devrait appeler service.findAllRecettes et retourner le résultat', async () => {
      // 1. Arrange (Préparation)
      const mockRecettes: Recettes[] = [
        new Recettes({ id: 1, quantite: '100.00', menuId: 1 }),
        new Recettes({ id: 2, quantite: '25.50', menuId: 1 }),
      ];
      // On dit à notre service mocké de retourner ces données quand findAllRecettes est appelée
      mockCuisinierService.findAllRecettes.mockResolvedValue(mockRecettes);

      // 2. Act (Action)
      const result = await controller.findAllRecettes();

      // 3. Assert (Vérification)
      // Vérifier que la méthode du service a bien été appelée
      expect(service.findAllRecettes).toHaveBeenCalled();
      
      // Vérifier que le résultat retourné par le contrôleur est bien celui de notre mock
      expect(result).toEqual(mockRecettes);
    });

    it('devrait gérer les erreurs si le service lève une exception', async () => {
      // 1. Arrange
      const errorMessage = 'Erreur base de données';
      // On simule une erreur
      mockCuisinierService.findAllRecettes.mockRejectedValue(new Error(errorMessage));

      // 2. & 3. Act & Assert
      // On vérifie que l'appel au contrôleur va bien rejeter une promesse avec l'erreur simulée
      await expect(controller.findAllRecettes()).rejects.toThrow(errorMessage);
    });
  });
});