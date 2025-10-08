/**
 * Registration Forms Mock Data Jest Tests
 */

const { mockRegistrationForms } = require('./data');
const {
  generateRegistrationForm,
  generateMultipleRegistrationForms,
} = require('./generate');

describe('Registration Forms Mock Data', () => {
  describe('mockRegistrationForms', () => {
    it('should have valid registration forms data', () => {
      expect(mockRegistrationForms).toBeDefined();
      expect(Array.isArray(mockRegistrationForms)).toBe(true);
      expect(mockRegistrationForms.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each form', () => {
      const requiredFields = [
        'id',
        'templateId',
        'templateName',
        'orderId',
        'status',
      ];

      mockRegistrationForms.forEach((form: any) => {
        requiredFields.forEach(field => {
          expect(form).toHaveProperty(field);
          expect(form[field]).toBeDefined();
        });
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['pending', 'completed', 'cancelled'];

      mockRegistrationForms.forEach((form: any) => {
        expect(validStatuses).toContain(form.status);
      });
    });

    it('should have valid template IDs', () => {
      mockRegistrationForms.forEach((form: any) => {
        expect(typeof form.templateId).toBe('string');
        expect(form.templateId.length).toBeGreaterThan(0);
      });
    });

    it('should have valid order IDs', () => {
      mockRegistrationForms.forEach((form: any) => {
        expect(form.orderId).toMatch(/^order-\d+$/);
      });
    });

    it('should have unique IDs', () => {
      const ids = mockRegistrationForms.map((f: any) => f.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid date formats', () => {
      mockRegistrationForms.forEach((form: any) => {
        expect(() => new Date(form.createdAt)).not.toThrow();
        expect(() => new Date(form.updatedAt)).not.toThrow();

        if (form.submittedAt) {
          expect(() => new Date(form.submittedAt)).not.toThrow();
        }
        if (form.completedAt) {
          expect(() => new Date(form.completedAt)).not.toThrow();
        }
      });
    });

    it('should have valid form data when present', () => {
      mockRegistrationForms.forEach((form: any) => {
        if (form.formData) {
          expect(typeof form.formData).toBe('object');
          expect(form.formData).not.toBeNull();
        }
      });
    });

    it('should have valid fields when present', () => {
      mockRegistrationForms.forEach((form: any) => {
        if (form.fields) {
          expect(Array.isArray(form.fields)).toBe(true);
          form.fields.forEach((field: any) => {
            expect(field).toHaveProperty('id');
            expect(field).toHaveProperty('name');
            expect(field).toHaveProperty('type');
            expect(field).toHaveProperty('label');
            expect(field).toHaveProperty('required');
            expect(typeof field.required).toBe('boolean');
          });
        }
      });
    });
  });

  describe('generateRegistrationForm', () => {
    it('should generate valid registration form with default values', () => {
      const form = generateRegistrationForm(
        'test-form-1',
        'default-template',
        'Test Template',
        'test-order-1',
        'test-order-1-item-1',
        'test-ticket-1'
      );

      expect(form.id).toBe('test-form-1');
      expect(form.templateId).toBe('default-template');
      expect(form.templateName).toBe('Test Template');
      expect(form.orderId).toBe('test-order-1');
      expect(form.ticketId).toBe('test-ticket-1');
      expect(form.status).toBe('pending');
    });

    it('should generate form with custom values', () => {
      const form = generateRegistrationForm(
        'custom-form-1',
        'template-1',
        'Custom Template',
        'custom-order-1',
        'custom-order-1-item-1',
        'custom-ticket-1',
        'completed',
        { name: 'Test User', email: 'test@example.com' }
      );

      expect(form.templateId).toBe('template-1');
      expect(form.templateName).toBe('Custom Template');
      expect(form.status).toBe('completed');
      expect(form.formData).toEqual({
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });

  describe('generateMultipleRegistrationForms', () => {
    it('should generate specified number of forms', () => {
      const forms = generateMultipleRegistrationForms(5);
      expect(forms).toHaveLength(5);
    });

    it('should generate forms with valid structure', () => {
      const forms = generateMultipleRegistrationForms(3);

      forms.forEach((form: any) => {
        expect(form.id).toMatch(/^form-\d+$/);
        expect(typeof form.templateId).toBe('string');
        expect(form.orderId).toMatch(/^order-\d+$/);
        expect(['pending', 'completed', 'cancelled']).toContain(form.status);
      });
    });

    it('should generate unique form IDs', () => {
      const forms = generateMultipleRegistrationForms(10);
      const ids = forms.map((f: any) => f.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should generate forms with different statuses', () => {
      const forms = generateMultipleRegistrationForms(10);
      const statuses = forms.map((f: any) => f.status);
      const uniqueStatuses = new Set(statuses);

      // 應該包含多種狀態
      expect(uniqueStatuses.size).toBeGreaterThan(1);
    });
  });
});
