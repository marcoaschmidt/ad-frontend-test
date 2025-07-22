import { execSync } from 'child_process';
import path from 'path';

describe('Linting Tests', () => {
  const projectRoot = path.resolve(__dirname, '../..');

  it('should pass ESLint checks', () => {
    expect(() => {
      execSync('npm run lint', { 
        cwd: projectRoot, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
    }).not.toThrow();
  });

  it('should have no TypeScript errors', () => {
    expect(() => {
      execSync('npx tsc --noEmit', { 
        cwd: projectRoot, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
    }).not.toThrow();
  });

  it('should pass build process', () => {
    expect(() => {
      execSync('npm run build', { 
        cwd: projectRoot, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
    }).not.toThrow();
  });
});