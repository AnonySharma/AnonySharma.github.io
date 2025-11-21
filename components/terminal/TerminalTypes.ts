
import React from 'react';

export interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'boot' | 'component';
  content: React.ReactNode;
  timestamp?: string;
}

export type FileNode = {
  type: 'file';
  content: string | React.ReactNode;
  isBinary?: boolean;
  url?: string; 
};

export type DirNode = {
  type: 'dir';
  children: Record<string, FileNode | DirNode>;
};

export type FSNode = FileNode | DirNode;
