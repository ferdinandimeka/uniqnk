"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalPath = exports.getStaticFilePath = exports.removeLocalFile = void 0;
exports.removeUnusedMulterImageFilesOnError = removeUnusedMulterImageFilesOnError;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const removeLocalFile = (localPath) => {
    fs_1.default.unlink(localPath, (err) => {
        if (err) {
            console.log("Error while removing local files", err);
        }
        console.log("Local file removed successfully", localPath);
    });
};
exports.removeLocalFile = removeLocalFile;
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
function removeUnusedMulterImageFilesOnError(fileObj) {
    try {
        if (!fileObj || typeof fileObj !== "object")
            return;
        Object.values(fileObj).forEach((file) => {
            // Validate file object
            if (!file || typeof file !== "object")
                return;
            const filePath = file.path;
            // Ensure path is a valid string and not root or directory
            if (!filePath ||
                typeof filePath !== "string" ||
                filePath.trim() === "" ||
                filePath === "/" ||
                filePath === "\\" ||
                path_1.default.resolve(filePath) === path_1.default.parse(filePath).root) {
                console.warn(`Skipping invalid or root path: ${filePath}`);
                return;
            }
            try {
                if (fs_1.default.existsSync(filePath) && fs_1.default.lstatSync(filePath).isFile()) {
                    fs_1.default.unlinkSync(filePath);
                    console.log(`Deleted file: ${filePath}`);
                }
                else {
                    console.warn(`File not found or not a file: ${filePath}`);
                }
            }
            catch (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
            }
        });
    }
    catch (error) {
        console.error("Error while removing image files:", error);
    }
}
/**
 *
 * @param {import("express").Request} req
 * @param {string} fileName
 * @description returns the file's static path from where the server is serving the static image
 */
const getStaticFilePath = (req, fileName) => {
    return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};
exports.getStaticFilePath = getStaticFilePath;
/**
 *
 * @param {string} fileName
 * @description returns the file's local path in the file system to assist future removal
 */
const getLocalPath = (fileName) => {
    return `${fileName}`;
};
exports.getLocalPath = getLocalPath;
