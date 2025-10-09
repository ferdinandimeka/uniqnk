import fs from "fs";
import { Multer } from "multer";
import path from "path"

export const removeLocalFile = (localPath: fs.PathLike) => {
    fs.unlink(localPath, (err) => {
        if (err) {
            console.log("Error while removing local files", err);
        }
        console.log("Local file removed successfully", localPath);
    });
}

// export function removeUnusedMulterImageFilesOnError(fileObj: Record<string, any> | undefined | null) {
//   try {
//     if (fileObj && typeof fileObj === 'object') {
//       Object.values(fileObj).forEach((file) => {
//         // Ensure it's a valid file object with a path
//         if (file && typeof file === 'object' && file.path && typeof file.path === 'string') {
//           if (fs.existsSync(file.path)) {
//             fs.unlinkSync(file.path);
//             console.log(`Deleted file: ${file.path}`);
//           } else {
//             console.warn(`File not found: ${file.path}`);
//           }
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Error while removing image files:", error);
//   }
// }

export function removeUnusedMulterImageFilesOnError(
  fileObj: Record<string, any> | undefined | null
) {
  try {
    if (!fileObj || typeof fileObj !== "object") return;

    Object.values(fileObj).forEach((file) => {
      // Validate file object
      if (!file || typeof file !== "object") return;
      const filePath = file.path;

      // Ensure path is a valid string and not root or directory
      if (
        !filePath ||
        typeof filePath !== "string" ||
        filePath.trim() === "" ||
        filePath === "/" ||
        filePath === "\\" ||
        path.resolve(filePath) === path.parse(filePath).root
      ) {
        console.warn(`Skipping invalid or root path: ${filePath}`);
        return;
      }

      try {
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        } else {
          console.warn(`File not found or not a file: ${filePath}`);
        }
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    });
  } catch (error) {
    console.error("Error while removing image files:", error);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {string} fileName
 * @description returns the file's static path from where the server is serving the static image
 */
export const getStaticFilePath = (req: { protocol: any; get: (arg0: string) => any; }, fileName: any) => {
    return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

/**
 *
 * @param {string} fileName
 * @description returns the file's local path in the file system to assist future removal
 */
export const getLocalPath = (fileName: any) => {
    return `${fileName}`;
};