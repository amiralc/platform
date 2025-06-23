import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationHierarchyComponent,OrganizationNode } from './hierarchy-display.component';
import { By } from '@angular/platform-browser';

describe('OrganizationHierarchyComponent', () => {
  let component: OrganizationHierarchyComponent;
  let fixture: ComponentFixture<OrganizationHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationHierarchyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationHierarchyComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty nodes', () => {
    expect(component.nodes).toEqual([]);
  });

  it('should toggle expansion for nodes with children', () => {
    const nodeWithChildren: OrganizationNode = {
      id: 1,
      name: 'Manager',
      title: 'Lead',
      expanded: false,
      children: [{ id: 2, name: 'Dev', title: 'Developer' }]
    };

    const nodeWithoutChildren: OrganizationNode = {
      id: 2,
      name: 'Dev',
      title: 'Developer',
      expanded: false
    };

    component.toggleExpand(nodeWithChildren);
    expect(nodeWithChildren.expanded).toBeTrue();

    component.toggleExpand(nodeWithoutChildren);
    expect(nodeWithoutChildren.expanded).toBeFalsy();
  });

  it('should expand all nodes if expandAll is true', () => {
    component.nodes = [
      {
        id: 1,
        name: 'Manager',
        title: 'Lead',
        expanded: false,
        children: [
          { id: 2, name: 'Dev', title: 'Developer' }
        ]
      }
    ];
    component.expandAll = true;
    component.ngOnInit(); // appelle manuellement ngOnInit
    expect(component.nodes[0].expanded).toBeTrue();
  });

  it('should track nodes by id', () => {
    const node: OrganizationNode = { id: 99, name: 'Node', title: 'Title' };
    expect(component.trackById(0, node)).toBe(99);
  });

  it('should render node name and title', () => {
    component.nodes = [
      {
        id: 1,
        name: 'John Doe',
        title: 'Manager',
        photoUrl: 'photo.jpg'
      }
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('Manager');
  });

  it('should render nested children when expanded', () => {
    component.nodes = [
      {
        id: 1,
        name: 'Manager',
        title: 'Lead',
        expanded: true,
        children: [
          {
            id: 2,
            name: 'Dev 1',
            title: 'Developer'
          }
        ]
      }
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const nodeElements = compiled.querySelectorAll('.node');
    expect(nodeElements.length).toBeGreaterThan(1); // parent + children
  });
});
