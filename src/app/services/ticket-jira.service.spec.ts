import { TestBed } from '@angular/core/testing';

import { TicketJiraService } from './ticket-jira.service';

describe('TicketJiraService', () => {
  let service: TicketJiraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketJiraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
