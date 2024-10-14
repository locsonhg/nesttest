export class HandleUrlImageService {
  static formatImagePaths(imagePaths: string[]): string[] {
    return imagePaths.map((path) => path.replace(/\\/g, '/'));
  }
}
