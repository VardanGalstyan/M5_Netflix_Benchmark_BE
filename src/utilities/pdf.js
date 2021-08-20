// Define font files
import PdfPrinter from 'pdfmake'

const fonts = {
    Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
    },
};

export const generatePdfStream = async (mediaPost) => {

    const printer = new PdfPrinter(fonts);


    const docDefinition = {
        content: [
            {
                text: mediaPost.Title,
                style: "header"
            }
        ]
    };

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
    pdfReadableStream.end();
    return pdfReadableStream
}


