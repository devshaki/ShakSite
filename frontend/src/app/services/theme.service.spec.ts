import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should expose additional themes for selection', () => {
    expect(service.availableThemes).toContain('dawn');
    expect(service.availableThemes).toContain('midnight');
    expect(service.availableThemes).toContain('hellokitty');
  });

  it('should set the selected theme', () => {
    service.setTheme('dawn');
    expect(service.currentTheme()).toBe('dawn');
  });
});
