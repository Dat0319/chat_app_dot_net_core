// common.ts - Frontend helper utilities with TypeScript

import { format, isValid, parse } from "date-fns";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Date formatting utilities using date-fns
 */
export const dateUtils = {
  /**
   * Format a date using date-fns
   * @param {Date|string|number} date - The date to format
   * @param {string} formatStr - Format string (e.g., 'yyyy-MM-dd')
   * @param {Object} options - Additional options for date-fns
   * @returns {string} Formatted date string
   */
  formatDate: (
    date: Date | string | number,
    formatStr: string = "yyyy-MM-dd",
    options: Record<string, any> = {}
  ): string => {
    try {
      if (!date) return "";

      // Handle different input types
      const validDate = typeof date === "string" ? new Date(date) : date;

      if (!isValid(validDate)) return "";

      return format(validDate, formatStr, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  },

  /**
   * Parse a string to Date object
   * @param {string} dateString - Date string to parse
   * @param {string} formatStr - Format of the input string
   * @param {Date} referenceDate - Reference date for relative parsing
   * @returns {Date} Parsed Date object
   */
  parseDate: (
    dateString: string,
    formatStr: string = "yyyy-MM-dd",
    referenceDate: Date = new Date()
  ): Date | null => {
    try {
      if (!dateString) return null;
      return parse(dateString, formatStr, referenceDate);
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  },

  /**
   * Get relative time (today, yesterday, etc.)
   * @param {Date|string|number} date - Date to compare
   * @returns {string} Relative time string
   */
  getRelativeTime: (date: Date | string | number): string => {
    // Implement relative time logic here
    // This can be extended based on requirements
    return "Implement relative time based on your needs";
  }
};

/**
 * Define types for export utilities
 */
interface PdfExportOptions {
  orientation?: "portrait" | "landscape";
  pageSize?: string;
  title?: string;
  tableOptions?: Record<string, any>;
}

interface ColumnDefinition {
  field: string;
  header?: string;
}

/**
 * Export utilities for PDF and Excel
 */
export const exportUtils = {
  /**
   * Export data to Excel file
   * @param {Array} data - Data to export
   * @param {string} fileName - Name of the file (without extension)
   * @param {string} sheetName - Name of the sheet
   */
  toExcel: (
    data: Record<string, any>[],
    fileName: string = "export",
    sheetName: string = "Sheet1"
  ): void => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      saveAs(blob, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw new Error("Failed to export Excel file");
    }
  },

  /**
   * Export data to PDF file
   * @param {Array} data - Data to export
   * @param {Array} columns - Column definitions
   * @param {string} fileName - Name of the file (without extension)
   * @param {Object} options - PDF options
   */
  toPdf: (
    data: Record<string, any>[],
    columns: ColumnDefinition[],
    fileName: string = "export",
    options: PdfExportOptions = {}
  ): void => {
    try {
      const doc = new jsPDF(
        options.orientation || "portrait",
        "pt",
        options.pageSize || "a4"
      );

      // Add title if specified
      if (options.title) {
        doc.setFontSize(18);
        doc.text(options.title, 40, 40);
        doc.setFontSize(10);
      }

      // Prepare columns and rows for autotable
      const columnsDef = columns.map((col) => ({
        header: col.header || col.field,
        dataKey: col.field
      }));

      doc.autoTable({
        columns: columnsDef,
        body: data,
        startY: options.title ? 60 : 40,
        ...options.tableOptions
      });

      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      throw new Error("Failed to export PDF file");
    }
  },

  /**
   * Generate CSV content
   * @param {Array} data - Data to convert to CSV
   * @param {Array} fields - Fields to include
   * @returns {string} CSV content
   */
  generateCsv: (data: Record<string, any>[], fields?: string[]): string => {
    try {
      if (!data || !data.length) return "";

      // Use all fields if none specified
      const headerFields = fields || Object.keys(data[0]);

      // Create header row
      let csvContent = headerFields.join(",") + "\n";

      // Add data rows
      data.forEach((item) => {
        const row = headerFields.map((field) => {
          const value = item[field];
          // Escape quotes and wrap in quotes if needed
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value !== undefined && value !== null ? value : "";
        });
        csvContent += row.join(",") + "\n";
      });

      return csvContent;
    } catch (error) {
      console.error("Error generating CSV:", error);
      return "";
    }
  }
};

/**
 * Parsing utilities for handling JSON and FormData
 */
export const parseUtils = {
  /**
   * Safely parse JSON string to object
   * @param {string} jsonString - JSON string to parse
   * @param {T} defaultValue - Default value to return if parsing fails
   * @returns {T} Parsed object or default value
   */
  parseJSON: <T>(jsonString: string, defaultValue: T): T => {
    try {
      if (!jsonString) return defaultValue;
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.warn("Error parsing JSON:", error);
      return defaultValue;
    }
  },

  /**
   * Convert object to FormData
   * @param {Object} obj - Object to convert
   * @param {FormData} formData - Existing FormData to append to (optional)
   * @param {string} namespace - Namespace for nested objects
   * @returns {FormData} FormData object
   */
  objectToFormData: (
    obj: Record<string, any>,
    formData: FormData = new FormData(),
    namespace: string = ""
  ): FormData => {
    try {
      for (const key in obj) {
        if (
          Object.prototype.hasOwnProperty.call(obj, key) &&
          obj[key] !== undefined
        ) {
          const formKey = namespace ? `${namespace}[${key}]` : key;

          if (obj[key] === null) {
            formData.append(formKey, "");
          } else if (obj[key] instanceof Date) {
            formData.append(formKey, obj[key].toISOString());
          } else if (obj[key] instanceof File || obj[key] instanceof Blob) {
            formData.append(formKey, obj[key]);
          } else if (
            typeof obj[key] === "object" &&
            !(obj[key] instanceof File) &&
            !(obj[key] instanceof Blob)
          ) {
            parseUtils.objectToFormData(obj[key], formData, formKey);
          } else {
            formData.append(formKey, obj[key].toString());
          }
        }
      }
      return formData;
    } catch (error) {
      console.error("Error converting object to FormData:", error);
      throw new Error("Failed to convert object to FormData");
    }
  },

  /**
   * Convert FormData to object
   * @param {FormData} formData - FormData to convert
   * @returns {Object} Object representation of FormData
   */
  formDataToObject: (formData: FormData): Record<string, any> => {
    try {
      const obj: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        obj[key] = value;
      }
      return obj;
    } catch (error) {
      console.error("Error converting FormData to object:", error);
      return {};
    }
  }
};

/**
 * String utilities
 */
export const stringUtils = {
  /**
   * Capitalize first letter of a string
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalize: (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Truncate string to a certain length
   * @param {string} str - String to truncate
   * @param {number} length - Maximum length
   * @param {string} suffix - Suffix to add if truncated
   * @returns {string} Truncated string
   */
  truncate: (
    str: string,
    length: number = 50,
    suffix: string = "..."
  ): string => {
    if (!str) return "";
    return str.length > length ? str.substring(0, length) + suffix : str;
  }
};

// Define the type for the combined utility object
interface CommonUtilities {
  date: typeof dateUtils;
  export: typeof exportUtils;
  parse: typeof parseUtils;
  string: typeof stringUtils;
}

// Export all utilities as a single object for convenience
const commonUtils: CommonUtilities = {
  date: dateUtils,
  export: exportUtils,
  parse: parseUtils,
  string: stringUtils
};

export default commonUtils;

// example
// ```typescript
// import commonUtils from './path/to/common';

// Format a date
// const formattedDate = commonUtils.date.formatDate(new Date(), 'MMM dd, yyyy');

// Export data to Excel
// commonUtils.export.toExcel(dataArray, 'report');

// Safely parse JSON
// const data = commonUtils.parse.parseJSON(jsonString, []);
// ```
