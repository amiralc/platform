import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OrganizationNode {
  id: number;
  name: string;
  title: string;
  photoUrl?: string;
  expanded?: boolean;
  children?: OrganizationNode[];
}

@Component({
  selector: 'app-organization-hierarchy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-hierarchy.component.html',
  styleUrls: ['./organization-hierarchy.component.scss']
})
export class OrganizationHierarchyComponent {
  @Input() nodes: OrganizationNode[] = [];
  @Input() expandAll = false;

  ngOnInit(): void {
    if (this.expandAll) {
      this.expandAllNodes();
    }
  }

  toggleExpand(node: OrganizationNode): void {
    if (node.children) {
      node.expanded = !node.expanded;
    }
  }

  private expandAllNodes(): void {
    const expandNodes = (nodes: OrganizationNode[]) => {
      nodes.forEach(node => {
        if (node.children) {
          node.expanded = true;
          expandNodes(node.children);
        }
      });
    };
    expandNodes(this.nodes);
  }

  trackById(index: number, node: OrganizationNode): number {
    return node.id;
  }
}