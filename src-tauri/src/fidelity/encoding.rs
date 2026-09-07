use serde::{Deserialize, Serialize};
use xxhash_rust::xxh64::xxh64;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum LineEnding {
    LF,
    CRLF,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum FileEncoding {
    #[serde(rename = "UTF-8")]
    Utf8,
    #[serde(rename = "UTF-8-BOM")]
    Utf8Bom,
}

pub struct DetectedFile {
    pub content: String,
    pub line_ending: LineEnding,
    pub encoding: FileEncoding,
    pub hash: String,
}

pub fn detect_and_read(bytes: &[u8]) -> Result<DetectedFile, String> {
    let hash = format!("{:x}", xxh64(bytes, 0));

    // Check for UTF-8 BOM: 0xEF, 0xBB, 0xBF
    let (encoding, text_bytes) = if bytes.starts_with(&[0xEF, 0xBB, 0xBF]) {
        (FileEncoding::Utf8Bom, &bytes[3..])
    } else {
        (FileEncoding::Utf8, bytes)
    };

    let content = match std::str::from_utf8(text_bytes) {
        Ok(s) => s.to_string(),
        Err(_) => {
            // Fallback to lossy decoding if invalid UTF-8 bytes exist
            String::from_utf8_lossy(text_bytes).to_string()
        }
    };

    let line_ending = if content.contains("\r\n") {
        LineEnding::CRLF
    } else {
        LineEnding::LF
    };

    Ok(DetectedFile {
        content,
        line_ending,
        encoding,
        hash,
    })
}

pub fn prepare_bytes_for_save(
    content: &str,
    line_ending: LineEnding,
    encoding: FileEncoding,
) -> Vec<u8> {
    let mut normalized = content.replace("\r\n", "\n");
    if line_ending == LineEnding::CRLF {
        normalized = normalized.replace('\n', "\r\n");
    }

    let mut result = Vec::new();
    if encoding == FileEncoding::Utf8Bom {
        result.extend_from_slice(&[0xEF, 0xBB, 0xBF]);
    }
    result.extend_from_slice(normalized.as_bytes());
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_detect_lf() {
        let raw = b"# Header\nLine 2\n";
        let detected = detect_and_read(raw).unwrap();
        assert_eq!(detected.line_ending, LineEnding::LF);
        assert_eq!(detected.encoding, FileEncoding::Utf8);
        assert_eq!(detected.content, "# Header\nLine 2\n");
    }

    #[test]
    fn test_detect_crlf_and_bom() {
        let mut raw = vec![0xEF, 0xBB, 0xBF];
        raw.extend_from_slice(b"# Header\r\nLine 2\r\n");
        let detected = detect_and_read(&raw).unwrap();
        assert_eq!(detected.line_ending, LineEnding::CRLF);
        assert_eq!(detected.encoding, FileEncoding::Utf8Bom);
    }
}
