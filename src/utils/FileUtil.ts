export class FileUtil {
  public static loadImageBase64(fileData: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  public static loadImage(fileData: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(fileData);
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = reject;
    });
  }

  public static loadImages(fileData: File[]): Promise<HTMLImageElement[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<HTMLImageElement>[] = fileData.map((data: File) =>
        FileUtil.loadImage(data)
      );
      Promise.all(promises)
        .then((values: HTMLImageElement[]) => resolve(values))
        .catch(error => reject(error));
    });
  }

  public static readFile(fileData: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (event: any) => {
        resolve(event?.target?.result);
      };
      reader.onerror = reject;
      reader.readAsText(fileData);
    });
  }

  public static readFiles(fileData: File[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<string>[] = fileData.map((data: File) =>
        FileUtil.readFile(data)
      );
      Promise.all(promises)
        .then((values: string[]) => resolve(values))
        .catch(error => reject(error));
    });
  }

  public static extractFileExtension(name: string): string | null {
    const parts = name.split(".");
    return parts.length > 1 ? parts[parts.length - 1] : null;
  }

  public static extractFileName(name: string): string | null {
    const splitPath = name.split(".");
    let fName = "";
    for (const idx of Array(splitPath.length - 1).keys()) {
      if (fName === "") fName += splitPath[idx];
      else fName += "." + splitPath[idx];
    }
    return fName;
  }

  /**
   * 将图片 URL 或 base64 编码转换为 File 对象
   * @param imageUrl 图片的 URL 或 base64 编码
   * @param filename 生成的 File 对象的文件名
   * @returns Promise<File>
   */
  public static async imageToFile(
    imageUrl: string,
    filename: string
  ): Promise<File> {
    // 检查是否为 Base64 数据
    if (imageUrl.startsWith("data:")) {
      // 如果是 Base64 数据，则解析 Base64 并转换为 Blob
      const [meta, base64Data] = imageUrl.split(",");
      const mimeType = meta.match(/:(.*?);/)?.[1] || "image/png"; // 获取图片的 MIME 类型
      const binary = atob(base64Data); // 解码 base64 数据
      const array = new Uint8Array(binary.length);

      // 将 base64 转换为二进制数组
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      // 创建 Blob 对象
      const blob = new Blob([array], { type: mimeType });
      return new File([blob], filename, { type: mimeType });
    } else {
      // 如果是 URL 数据，使用 fetch 获取数据并转换为 Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    }
  }
}
