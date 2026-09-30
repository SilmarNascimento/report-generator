package com.mateco.reportgenerator.service.implementation;

import com.mateco.reportgenerator.controller.dto.student.AddressDto;
import com.mateco.reportgenerator.controller.dto.student.StudentImportErrorDto;
import com.mateco.reportgenerator.controller.dto.student.StudentImportResultDto;
import com.mateco.reportgenerator.controller.dto.student.StudentRequestDto;
import com.mateco.reportgenerator.enums.ClassGroup;
import com.mateco.reportgenerator.enums.StudentImportColumn;
import com.mateco.reportgenerator.enums.UF;
import com.mateco.reportgenerator.mapper.StudentMapper;
import com.mateco.reportgenerator.model.entity.Student;
import com.mateco.reportgenerator.model.repository.StudentRepository;
import com.mateco.reportgenerator.model.repository.UserRepository;
import com.mateco.reportgenerator.service.StudentImportServiceInterface;
import com.mateco.reportgenerator.service.exception.InvalidDataException;
import com.mateco.reportgenerator.utils.TextUtils;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.ooxml.POIXMLException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.Year;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.mateco.reportgenerator.enums.StudentImportColumn.*;

@Service
@RequiredArgsConstructor
public class StudentImportService implements StudentImportServiceInterface {

    private static final int MAX_ROWS = 1000;
    private static final int MIN_ENROLLMENT_YEAR = 2000;
    private static final int MIN_NAME_LENGTH = 3;
    private static final int MAX_NAME_LENGTH = 100;
    private static final int MAX_EMAIL_LENGTH = 100;
    private static final int MAX_TEXT_LENGTH = 255;

    private static final Set<String> WORKBOOK_EXTENSIONS = Set.of("xlsx", "xlsm", "xltx", "xltm", "xls", "xlt");
    private static final String CSV_EXTENSION = "csv";
    private static final String ACCEPTED_EXTENSIONS = ".xlsx, .xlsm, .xltx, .xltm, .xls, .xlt ou .csv";
    private static final Charset WINDOWS_1252 = Charset.forName("windows-1252");
    private static final Locale PT_BR = Locale.forLanguageTag("pt-BR");

    private static final Pattern NAME_PATTERN = Pattern.compile("^\\p{L}+(?:[ '.-]+\\p{L}+)*\\.?$");
    private static final Pattern CITY_PATTERN = Pattern.compile("^\\p{L}+(?:[ '.-]+\\p{L}+)*$");
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}$");
    private static final Pattern ADDRESS_NUMBER_PATTERN =
            Pattern.compile("^(?:\\d{1,6}(?:[ -]?[A-Za-z])?|S/?N)$", Pattern.CASE_INSENSITIVE);
    private static final Pattern FORMATTED_DIGITS_PATTERN = Pattern.compile("^[0-9 .()/+-]+$");
    private static final Pattern LETTER_PATTERN = Pattern.compile("\\p{L}");
    private static final Pattern NON_DIGIT_PATTERN = Pattern.compile("\\D");
    private static final Pattern MULTIPLE_SPACES_PATTERN = Pattern.compile("\\s+");
    private static final Pattern LIST_SEPARATOR_PATTERN = Pattern.compile("[,;|]");
    private static final Pattern NON_ALPHANUMERIC_PATTERN = Pattern.compile("[^a-z0-9]+");
    private static final Pattern INVISIBLE_CHARS_PATTERN = Pattern.compile("[\\u200B-\\u200D\\u2060\\uFEFF]");
    private static final Pattern SPECIAL_SPACES_PATTERN = Pattern.compile("[\\u00A0\\u2007\\u202F]");
    private static final Pattern WITHOUT_NUMBER_PATTERN = Pattern.compile("^S/?N$", Pattern.CASE_INSENSITIVE);

    private static final Set<String> LOWERCASE_NAME_PARTICLES =
            Set.of("da", "das", "de", "do", "dos", "e", "di", "du", "del", "della", "van", "von");

    private static final List<StudentImportColumn> ADDRESS_COLUMNS =
            List.of(STREET, NUMBER, COMPLEMENT, NEIGHBORHOOD, CITY, STATE, ZIP_CODE);

    private static final Map<String, StudentImportColumn> PROPERTY_COLUMNS = Map.ofEntries(
            Map.entry("name", NAME),
            Map.entry("email", EMAIL),
            Map.entry("cpf", CPF),
            Map.entry("phone", PHONE),
            Map.entry("enrollmentYear", ENROLLMENT_YEAR),
            Map.entry("classGroups", CLASS_GROUPS),
            Map.entry("photoUrl", PHOTO),
            Map.entry("address.street", STREET),
            Map.entry("address.number", NUMBER),
            Map.entry("address.complement", COMPLEMENT),
            Map.entry("address.neighborhood", NEIGHBORHOOD),
            Map.entry("address.city", CITY),
            Map.entry("address.state", STATE),
            Map.entry("address.zipCode", ZIP_CODE)
    );

    private static final Map<String, UF> STATE_NAMES = Map.ofEntries(
            Map.entry("acre", UF.AC), Map.entry("alagoas", UF.AL), Map.entry("amapa", UF.AP),
            Map.entry("amazonas", UF.AM), Map.entry("bahia", UF.BA), Map.entry("ceara", UF.CE),
            Map.entry("distrito federal", UF.DF), Map.entry("espirito santo", UF.ES), Map.entry("goias", UF.GO),
            Map.entry("maranhao", UF.MA), Map.entry("mato grosso", UF.MT), Map.entry("mato grosso do sul", UF.MS),
            Map.entry("minas gerais", UF.MG), Map.entry("para", UF.PA), Map.entry("paraiba", UF.PB),
            Map.entry("parana", UF.PR), Map.entry("pernambuco", UF.PE), Map.entry("piaui", UF.PI),
            Map.entry("rio de janeiro", UF.RJ), Map.entry("rio grande do norte", UF.RN),
            Map.entry("rio grande do sul", UF.RS), Map.entry("rondonia", UF.RO), Map.entry("roraima", UF.RR),
            Map.entry("santa catarina", UF.SC), Map.entry("sao paulo", UF.SP), Map.entry("sergipe", UF.SE),
            Map.entry("tocantins", UF.TO)
    );

    private static final String ACCEPTED_CLASS_GROUPS = Arrays.stream(ClassGroup.values())
            .map(Enum::name)
            .collect(Collectors.joining(", "));

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final StudentMapper studentMapper;
    private final Validator validator;

    @Override
    @Transactional
    public StudentImportResultDto importStudents(MultipartFile file) {
        String extension = validateFile(file);

        List<RawRow> rawRows = CSV_EXTENSION.equals(extension) ? readCsvRows(file) : readWorkbookRows(file);
        SpreadsheetContent content = buildContent(rawRows);
        if (!content.headerErrors().isEmpty()) {
            return new StudentImportResultDto(content.rows().size(), 0, content.headerErrors());
        }

        List<StudentImportErrorDto> errors = new ArrayList<>();
        List<StudentRequestDto> validStudents = new ArrayList<>();
        Map<String, Integer> emailRows = new HashMap<>();
        Map<String, Integer> cpfRows = new HashMap<>();

        for (SpreadsheetRow row : content.rows()) {
            RowErrors rowErrors = new RowErrors(row);
            StudentRequestDto student = buildStudent(row, rowErrors);

            applyBeanValidation(student, rowErrors);
            checkDuplicates(student, rowErrors, emailRows, cpfRows);

            if (rowErrors.isEmpty()) {
                validStudents.add(student);
            } else {
                errors.addAll(rowErrors.toDtos());
            }
        }

        if (!errors.isEmpty()) {
            return new StudentImportResultDto(content.rows().size(), 0, errors);
        }

        List<Student> students = validStudents.stream()
                .map(studentMapper::toEntity)
                .toList();
        studentRepository.saveAll(students);

        return new StudentImportResultDto(content.rows().size(), students.size(), List.of());
    }

    private String validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidDataException("Nenhuma planilha foi enviada");
        }

        String fileName = Optional.ofNullable(file.getOriginalFilename()).orElse("");
        String extension = fileName.contains(".")
                ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT)
                : "";

        if (!WORKBOOK_EXTENSIONS.contains(extension) && !CSV_EXTENSION.equals(extension)) {
            throw new InvalidDataException("Formato de arquivo inválido. Envie uma planilha " + ACCEPTED_EXTENSIONS);
        }

        return extension;
    }

    private List<RawRow> readWorkbookRows(MultipartFile file) {
        // WorkbookFactory identifica o formato pelo conteúdo (Excel 97-2003 ou Excel 2007+)
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter(PT_BR);
            FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

            List<RawRow> rows = new ArrayList<>();
            for (Row row : sheet) {
                Map<Integer, SheetCell> cells = new HashMap<>();
                for (Cell cell : row) {
                    cells.put(cell.getColumnIndex(), readCell(cell, formatter, evaluator));
                }
                rows.add(new RawRow(row.getRowNum() + 1, cells));
            }

            return rows;
        } catch (EncryptedDocumentException exception) {
            throw new InvalidDataException("A planilha está protegida por senha. Remova a senha e envie novamente");
        } catch (IOException | IllegalArgumentException | POIXMLException exception) {
            throw new InvalidDataException(
                    "Não foi possível ler a planilha. Verifique se o arquivo é um " + ACCEPTED_EXTENSIONS + " válido");
        }
    }

    private List<RawRow> readCsvRows(MultipartFile file) {
        String content;
        try {
            content = decodeCsv(file.getBytes());
        } catch (IOException exception) {
            throw new InvalidDataException("Não foi possível ler o arquivo CSV");
        }

        char delimiter = detectCsvDelimiter(content);
        List<RawRow> rows = new ArrayList<>();
        List<String> fields = new ArrayList<>();
        StringBuilder field = new StringBuilder();
        boolean inQuotes = false;
        int lineNumber = 1;
        int recordStartLine = 1;

        for (int i = 0; i < content.length(); i++) {
            char current = content.charAt(i);

            if (inQuotes) {
                if (current == '"' && i + 1 < content.length() && content.charAt(i + 1) == '"') {
                    field.append('"');
                    i++;
                } else if (current == '"') {
                    inQuotes = false;
                } else {
                    if (current == '\n') {
                        lineNumber++;
                    }
                    field.append(current);
                }
            } else if (current == '"' && field.isEmpty()) {
                inQuotes = true;
            } else if (current == delimiter) {
                fields.add(field.toString());
                field.setLength(0);
            } else if (current == '\r' || current == '\n') {
                if (current == '\r' && i + 1 < content.length() && content.charAt(i + 1) == '\n') {
                    i++;
                }
                fields.add(field.toString());
                field.setLength(0);
                rows.add(toRawRow(recordStartLine, fields));
                fields = new ArrayList<>();
                lineNumber++;
                recordStartLine = lineNumber;
            } else {
                field.append(current);
            }
        }

        if (!field.isEmpty() || !fields.isEmpty()) {
            fields.add(field.toString());
            rows.add(toRawRow(recordStartLine, fields));
        }

        return rows;
    }

    private String decodeCsv(byte[] bytes) {
        try {
            return StandardCharsets.UTF_8.newDecoder()
                    .onMalformedInput(CodingErrorAction.REPORT)
                    .onUnmappableCharacter(CodingErrorAction.REPORT)
                    .decode(ByteBuffer.wrap(bytes))
                    .toString()
                    .replace("\uFEFF", "");
        } catch (CharacterCodingException exception) {
            return new String(bytes, WINDOWS_1252);
        }
    }

    private char detectCsvDelimiter(String content) {
        int endOfFirstLine = content.indexOf('\n');
        String firstLine = endOfFirstLine >= 0 ? content.substring(0, endOfFirstLine) : content;

        long semicolons = firstLine.chars().filter(character -> character == ';').count();
        long commas = firstLine.chars().filter(character -> character == ',').count();
        long tabs = firstLine.chars().filter(character -> character == '\t').count();

        if (tabs > semicolons && tabs > commas) {
            return '\t';
        }
        return commas > semicolons ? ',' : ';';
    }

    private RawRow toRawRow(int rowNumber, List<String> fields) {
        Map<Integer, SheetCell> cells = new HashMap<>();
        for (int index = 0; index < fields.size(); index++) {
            cells.put(index, SheetCell.ofText(fields.get(index)));
        }
        return new RawRow(rowNumber, cells);
    }

    private SpreadsheetContent buildContent(List<RawRow> rawRows) {
        RawRow headerRow = rawRows.stream()
                .filter(row -> !row.isBlank())
                .findFirst()
                .orElseThrow(() -> new InvalidDataException("A planilha está vazia"));

        List<StudentImportErrorDto> headerErrors = new ArrayList<>();
        Map<StudentImportColumn, Integer> columnIndexes = readHeader(headerRow, headerErrors);

        List<SpreadsheetRow> rows = new ArrayList<>();
        for (RawRow rawRow : rawRows) {
            if (rawRow.rowNumber() <= headerRow.rowNumber()) {
                continue;
            }

            Map<StudentImportColumn, SheetCell> cells = new EnumMap<>(StudentImportColumn.class);
            columnIndexes.forEach((column, cellIndex) -> cells.put(column, rawRow.get(cellIndex)));

            if (cells.values().stream().allMatch(SheetCell::isBlank)) {
                continue;
            }

            rows.add(new SpreadsheetRow(rawRow.rowNumber(), cells));
            if (rows.size() > MAX_ROWS) {
                throw new InvalidDataException(
                        "A planilha excede o limite de " + MAX_ROWS + " alunos por importação");
            }
        }

        if (rows.isEmpty() && headerErrors.isEmpty()) {
            throw new InvalidDataException("A planilha não contém nenhum aluno para cadastrar");
        }

        return new SpreadsheetContent(rows, headerErrors);
    }

    private Map<StudentImportColumn, Integer> readHeader(RawRow headerRow, List<StudentImportErrorDto> headerErrors) {
        int headerRowNumber = headerRow.rowNumber();
        Map<StudentImportColumn, Integer> columnIndexes = new EnumMap<>(StudentImportColumn.class);

        List<Integer> cellIndexes = headerRow.cells().keySet().stream().sorted().toList();
        for (Integer cellIndex : cellIndexes) {
            String header = headerRow.get(cellIndex).text();
            if (header.isEmpty()) {
                continue;
            }

            Optional<StudentImportColumn> column = StudentImportColumn.fromHeader(header);
            if (column.isEmpty()) {
                headerErrors.add(new StudentImportErrorDto(headerRowNumber, header, header,
                        "Coluna não reconhecida. Use o modelo de planilha de cadastro de alunos"));
            } else if (columnIndexes.containsKey(column.get())) {
                headerErrors.add(new StudentImportErrorDto(headerRowNumber, header, header,
                        "Coluna duplicada na planilha"));
            } else {
                columnIndexes.put(column.get(), cellIndex);
            }
        }

        Arrays.stream(StudentImportColumn.values())
                .filter(StudentImportColumn::isRequiredHeader)
                .filter(column -> !columnIndexes.containsKey(column))
                .forEach(column -> headerErrors.add(new StudentImportErrorDto(headerRowNumber, column.getHeader(), "",
                        "Coluna obrigatória não encontrada no cabeçalho")));

        return columnIndexes;
    }

    private SheetCell readCell(Cell cell, DataFormatter formatter, FormulaEvaluator evaluator) {
        if (cell == null) {
            return SheetCell.EMPTY;
        }

        CellType type = cell.getCellType() == CellType.FORMULA
                ? cell.getCachedFormulaResultType()
                : cell.getCellType();
        String text = sanitizeText(formatCellValue(cell, type, formatter, evaluator));

        if (type != CellType.NUMERIC) {
            return SheetCell.ofText(text);
        }

        boolean isDate = DateUtil.isCellDateFormatted(cell);
        String plainNumber = BigDecimal.valueOf(cell.getNumericCellValue()).stripTrailingZeros().toPlainString();

        return new SheetCell(text, isDate, true, plainNumber);
    }

    private String formatCellValue(Cell cell, CellType type, DataFormatter formatter, FormulaEvaluator evaluator) {
        try {
            return formatter.formatCellValue(cell, evaluator);
        } catch (RuntimeException exception) {
            return switch (type) {
                case STRING -> cell.getRichStringCellValue().getString();
                case NUMERIC -> formatter.formatRawCellContents(cell.getNumericCellValue(),
                        cell.getCellStyle().getDataFormat(), cell.getCellStyle().getDataFormatString());
                case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
                default -> "";
            };
        }
    }

    // ------------------------------------------------------------------
    // Validação e conversão por campo
    // ------------------------------------------------------------------

    private StudentRequestDto buildStudent(SpreadsheetRow row, RowErrors errors) {
        String name = parseName(row.get(NAME), errors);
        String email = parseEmail(row.get(EMAIL), errors);
        String cpf = parseCpf(row.get(CPF), errors);
        Integer enrollmentYear = parseEnrollmentYear(row.get(ENROLLMENT_YEAR), errors);
        List<ClassGroup> classGroups = parseClassGroups(row.get(CLASS_GROUPS), errors);
        String phone = parsePhone(row.get(PHONE), errors);
        AddressDto address = parseAddress(row, errors);
        String photoUrl = parsePhotoUrl(row.get(PHOTO), errors);

        return new StudentRequestDto(
                name,
                email,
                null,
                cpf,
                phone,
                enrollmentYear,
                classGroups,
                OffsetDateTime.now(ZoneOffset.UTC),
                photoUrl,
                address
        );
    }

    private String parseName(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDateOrNumber(cell, NAME, errors, "um nome")) {
            return null;
        }

        String name = collapseSpaces(cell.text());
        if (!LETTER_PATTERN.matcher(name).find()) {
            errors.add(NAME, cell, "O valor não parece ser um nome");
            return null;
        }
        if (!NAME_PATTERN.matcher(name).matches()) {
            errors.add(NAME, cell, "O nome deve conter apenas letras, espaços, apóstrofos, hífens e pontos");
            return null;
        }
        if (name.length() < MIN_NAME_LENGTH || name.length() > MAX_NAME_LENGTH) {
            errors.add(NAME, cell, "O nome deve ter entre " + MIN_NAME_LENGTH + " e " + MAX_NAME_LENGTH + " caracteres");
            return null;
        }

        return capitalizeIfUniformCase(name);
    }

    private String parseEmail(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDateOrNumber(cell, EMAIL, errors, "um e-mail")) {
            return null;
        }

        String email = cell.text().toLowerCase(Locale.ROOT);
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            errors.add(EMAIL, cell, "Formato de e-mail inválido (ex.: aluno@dominio.com)");
            return null;
        }
        if (email.length() > MAX_EMAIL_LENGTH) {
            errors.add(EMAIL, cell, "O e-mail deve ter no máximo " + MAX_EMAIL_LENGTH + " caracteres");
            return null;
        }

        return email;
    }

    private String parseCpf(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDate(cell, CPF, errors, "um CPF")) {
            return null;
        }

        String value = cell.numberOrText();
        if (!FORMATTED_DIGITS_PATTERN.matcher(value).matches()) {
            errors.add(CPF, cell, "O CPF deve conter apenas números (pontos e hífen são aceitos)");
            return null;
        }

        // Excel remove zeros à esquerda quando a célula é numérica
        String cpf = restoreLeadingZeros(cell, NON_DIGIT_PATTERN.matcher(value).replaceAll(""), 11, 2);
        if (cpf.length() != 11) {
            errors.add(CPF, cell, "O CPF deve ter 11 dígitos (encontrados " + cpf.length() + ")");
            return null;
        }

        // A validação dos dígitos verificadores é feita pelo @CPF do StudentRequestDto
        return cpf;
    }

    private Integer parseEnrollmentYear(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDate(cell, ENROLLMENT_YEAR, errors, "apenas o ano (ex.: 2026)")) {
            return null;
        }

        String value = cell.numberOrText();
        int maxYear = Year.now().getValue() + 1;
        if (!value.matches("^\\d{4}$")) {
            errors.add(ENROLLMENT_YEAR, cell, "Informe o ano com 4 dígitos (ex.: 2026)");
            return null;
        }

        int year = Integer.parseInt(value);
        if (year < MIN_ENROLLMENT_YEAR || year > maxYear) {
            errors.add(ENROLLMENT_YEAR, cell,
                    "O ano de matrícula deve estar entre " + MIN_ENROLLMENT_YEAR + " e " + maxYear);
            return null;
        }

        return year;
    }

    private List<ClassGroup> parseClassGroups(SheetCell cell, RowErrors errors) {
        if (cell.isBlank()) {
            return List.of();
        }
        if (rejectDateOrNumber(cell, CLASS_GROUPS, errors, "o nome de uma turma")) {
            return null;
        }

        Set<ClassGroup> classGroups = new LinkedHashSet<>();
        List<String> unknownClassGroups = new ArrayList<>();

        for (String token : LIST_SEPARATOR_PATTERN.split(cell.text())) {
            if (token.isBlank()) {
                continue;
            }

            String enumName = NON_ALPHANUMERIC_PATTERN.matcher(TextUtils.normalize(token))
                    .replaceAll("_")
                    .replaceAll("^_|_$", "")
                    .toUpperCase(Locale.ROOT);
            try {
                classGroups.add(ClassGroup.valueOf(enumName));
            } catch (IllegalArgumentException exception) {
                unknownClassGroups.add(token.trim());
            }
        }

        if (!unknownClassGroups.isEmpty()) {
            errors.add(CLASS_GROUPS, cell, "Turma(s) não reconhecida(s): " + String.join(", ", unknownClassGroups)
                    + ". Valores aceitos (separados por vírgula): " + ACCEPTED_CLASS_GROUPS);
            return null;
        }

        return new ArrayList<>(classGroups);
    }

    private String parsePhone(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDate(cell, PHONE, errors, "um telefone")) {
            return null;
        }

        String value = cell.numberOrText();
        if (!FORMATTED_DIGITS_PATTERN.matcher(value).matches()) {
            errors.add(PHONE, cell, "O telefone deve conter apenas números, com DDD (ex.: (11) 9 1234-5678)");
            return null;
        }

        String phone = NON_DIGIT_PATTERN.matcher(value).replaceAll("");
        if (phone.startsWith("55") && (phone.length() == 12 || phone.length() == 13)) {
            phone = phone.substring(2);
        }

        boolean validLength = phone.length() == 10 || phone.length() == 11;
        boolean validAreaCode = validLength && phone.charAt(0) != '0' && phone.charAt(1) != '0';
        boolean validMobile = phone.length() != 11 || phone.charAt(2) == '9';

        if (!validLength || !validAreaCode || !validMobile) {
            errors.add(PHONE, cell, "Telefone inválido. Informe DDD + número (10 dígitos para fixo ou 11 para celular)");
            return null;
        }

        return phone;
    }

    private AddressDto parseAddress(SpreadsheetRow row, RowErrors errors) {
        boolean hasAnyAddressField = ADDRESS_COLUMNS.stream().anyMatch(column -> !row.get(column).isBlank());
        if (!hasAnyAddressField) {
            return null;
        }

        return new AddressDto(
                parseTextWithLetters(row.get(STREET), STREET, errors, "o nome da rua"),
                parseAddressNumber(row.get(NUMBER), errors),
                parseComplement(row.get(COMPLEMENT), errors),
                parseTextWithLetters(row.get(NEIGHBORHOOD), NEIGHBORHOOD, errors, "o nome do bairro"),
                parseCity(row.get(CITY), errors),
                parseState(row.get(STATE), errors),
                parseZipCode(row.get(ZIP_CODE), errors)
        );
    }

    private String parseTextWithLetters(SheetCell cell, StudentImportColumn column, RowErrors errors, String expected) {
        if (cell.isBlank() || rejectDateOrNumber(cell, column, errors, expected)) {
            return null;
        }

        String value = collapseSpaces(cell.text());
        if (!LETTER_PATTERN.matcher(value).find()) {
            errors.add(column, cell, "O valor não parece ser " + expected);
            return null;
        }
        if (value.length() > MAX_TEXT_LENGTH) {
            errors.add(column, cell, "O valor deve ter no máximo " + MAX_TEXT_LENGTH + " caracteres");
            return null;
        }

        return value;
    }

    private String parseAddressNumber(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDate(cell, NUMBER, errors, "o número do endereço")) {
            return null;
        }

        String value = collapseSpaces(cell.numberOrText()).toUpperCase(Locale.ROOT);
        if (!ADDRESS_NUMBER_PATTERN.matcher(value).matches()) {
            errors.add(NUMBER, cell, "Número inválido. Use apenas o número (ex.: 123 ou 123A) ou S/N");
            return null;
        }

        return WITHOUT_NUMBER_PATTERN.matcher(value).matches() ? "S/N" : value.replace(" ", "");
    }

    private String parseComplement(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDate(cell, COMPLEMENT, errors, "um complemento")) {
            return null;
        }

        String value = collapseSpaces(cell.numberOrText());
        if (value.length() > MAX_TEXT_LENGTH) {
            errors.add(COMPLEMENT, cell, "O complemento deve ter no máximo " + MAX_TEXT_LENGTH + " caracteres");
            return null;
        }

        return value;
    }

    private String parseCity(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDateOrNumber(cell, CITY, errors, "o nome de uma cidade")) {
            return null;
        }

        String city = collapseSpaces(cell.text());
        if (!CITY_PATTERN.matcher(city).matches()) {
            errors.add(CITY, cell, "A cidade deve conter apenas letras, espaços, apóstrofos e hífens");
            return null;
        }

        return capitalizeIfUniformCase(city);
    }

    private UF parseState(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDateOrNumber(cell, STATE, errors, "a sigla de um estado")) {
            return null;
        }

        String normalized = collapseSpaces(TextUtils.normalize(cell.text()));
        UF state = null;
        if (normalized.length() == 2) {
            state = Arrays.stream(UF.values())
                    .filter(uf -> uf.name().equalsIgnoreCase(normalized))
                    .findFirst()
                    .orElse(null);
        } else {
            state = STATE_NAMES.get(normalized);
        }

        if (state == null) {
            errors.add(STATE, cell, "Estado inválido. Use a sigla (ex.: SP) ou o nome completo (ex.: São Paulo)");
        }

        return state;
    }

    private String parseZipCode(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDate(cell, ZIP_CODE, errors, "um CEP")) {
            return null;
        }

        String value = cell.numberOrText();
        if (!FORMATTED_DIGITS_PATTERN.matcher(value).matches()) {
            errors.add(ZIP_CODE, cell, "O CEP deve conter apenas números (ex.: 01310-100)");
            return null;
        }

        String zipCode = restoreLeadingZeros(cell, NON_DIGIT_PATTERN.matcher(value).replaceAll(""), 8, 1);
        if (zipCode.length() != 8) {
            errors.add(ZIP_CODE, cell, "O CEP deve ter 8 dígitos (encontrados " + zipCode.length() + ")");
            return null;
        }

        return zipCode;
    }

    private String parsePhotoUrl(SheetCell cell, RowErrors errors) {
        if (cell.isBlank() || rejectDateOrNumber(cell, PHOTO, errors, "o link de uma foto")) {
            return null;
        }

        String url = cell.text();
        try {
            URI uri = new URI(url);
            boolean isHttp = "http".equalsIgnoreCase(uri.getScheme()) || "https".equalsIgnoreCase(uri.getScheme());
            if (!isHttp || uri.getHost() == null) {
                errors.add(PHOTO, cell, "A foto deve ser um link começando com http:// ou https://");
                return null;
            }
        } catch (URISyntaxException exception) {
            errors.add(PHOTO, cell, "Link da foto inválido");
            return null;
        }

        if (url.length() > MAX_TEXT_LENGTH) {
            errors.add(PHOTO, cell, "O link da foto deve ter no máximo " + MAX_TEXT_LENGTH + " caracteres");
            return null;
        }

        return url;
    }

    // ------------------------------------------------------------------
    // Validações entre campos / linhas
    // ------------------------------------------------------------------

    /**
     * Reaproveita as mesmas regras do cadastro individual (@NotBlank, @CPF, @Email...)
     * para campos que ainda não tiveram erro de formato.
     */
    private void applyBeanValidation(StudentRequestDto student, RowErrors errors) {
        Set<ConstraintViolation<StudentRequestDto>> violations = validator.validate(student);

        for (ConstraintViolation<StudentRequestDto> violation : violations) {
            StudentImportColumn column = PROPERTY_COLUMNS.get(violation.getPropertyPath().toString());
            if (column != null && !errors.hasErrorIn(column)) {
                errors.add(column, errors.row().get(column), violation.getMessage());
            }
        }
    }

    private void checkDuplicates(
            StudentRequestDto student,
            RowErrors errors,
            Map<String, Integer> emailRows,
            Map<String, Integer> cpfRows
    ) {
        int rowNumber = errors.row().rowNumber();

        if (student.email() != null && !errors.hasErrorIn(EMAIL)) {
            Integer firstRow = emailRows.putIfAbsent(student.email(), rowNumber);
            if (firstRow != null) {
                errors.add(EMAIL, errors.row().get(EMAIL), "E-mail repetido na planilha (também está na linha " + firstRow + ")");
            } else if (userRepository.existsByEmail(student.email())) {
                errors.add(EMAIL, errors.row().get(EMAIL), "E-mail já cadastrado no sistema");
            }
        }

        if (student.cpf() != null && !errors.hasErrorIn(CPF)) {
            Integer firstRow = cpfRows.putIfAbsent(student.cpf(), rowNumber);
            if (firstRow != null) {
                errors.add(CPF, errors.row().get(CPF), "CPF repetido na planilha (também está na linha " + firstRow + ")");
            } else if (studentRepository.existsByCpf(student.cpf())) {
                errors.add(CPF, errors.row().get(CPF), "CPF já cadastrado no sistema");
            }
        }
    }

    // ------------------------------------------------------------------
    // Utilitários
    // ------------------------------------------------------------------

    private boolean rejectDateOrNumber(SheetCell cell, StudentImportColumn column, RowErrors errors, String expected) {
        if (rejectDate(cell, column, errors, expected)) {
            return true;
        }
        if (cell.numeric()) {
            errors.add(column, cell, "O valor é numérico, mas era esperado " + expected);
            return true;
        }
        return false;
    }

    private boolean rejectDate(SheetCell cell, StudentImportColumn column, RowErrors errors, String expected) {
        if (cell.date()) {
            errors.add(column, cell, "O valor é uma data, mas era esperado " + expected);
            return true;
        }
        return false;
    }

    private String restoreLeadingZeros(SheetCell cell, String digits, int expectedLength, int maxMissingZeros) {
        boolean lostLeadingZeros = cell.numeric()
                && digits.length() < expectedLength
                && digits.length() >= expectedLength - maxMissingZeros;

        return lostLeadingZeros ? "0".repeat(expectedLength - digits.length()) + digits : digits;
    }

    private String collapseSpaces(String value) {
        return MULTIPLE_SPACES_PATTERN.matcher(value).replaceAll(" ").trim();
    }

    /**
     * Remove caracteres invisíveis e espaços especiais comuns em dados colados de outros sistemas.
     */
    private static String sanitizeText(String value) {
        if (value == null) {
            return "";
        }
        String withoutInvisible = INVISIBLE_CHARS_PATTERN.matcher(value).replaceAll("");
        String normalizedSpaces = SPECIAL_SPACES_PATTERN.matcher(withoutInvisible).replaceAll(" ");
        return MULTIPLE_SPACES_PATTERN.matcher(normalizedSpaces).replaceAll(" ").trim();
    }

    /**
     * "MARIA DA SILVA" ou "maria da silva" viram "Maria da Silva".
     * Textos com maiúsculas e minúsculas misturadas são mantidos como vieram.
     */
    private String capitalizeIfUniformCase(String value) {
        boolean isUniformCase = value.equals(value.toUpperCase(PT_BR)) || value.equals(value.toLowerCase(PT_BR));
        if (!isUniformCase) {
            return value;
        }

        String[] words = value.toLowerCase(PT_BR).split(" ");
        for (int index = 0; index < words.length; index++) {
            boolean isParticle = index > 0 && LOWERCASE_NAME_PARTICLES.contains(words[index]);
            if (!isParticle) {
                words[index] = capitalizeWord(words[index]);
            }
        }
        return String.join(" ", words);
    }

    private String capitalizeWord(String word) {
        StringBuilder result = new StringBuilder(word.length());
        boolean capitalizeNext = true;
        for (char character : word.toCharArray()) {
            result.append(capitalizeNext ? Character.toUpperCase(character) : character);
            capitalizeNext = character == '-' || character == '\'';
        }
        return result.toString();
    }

    private record SheetCell(String text, boolean date, boolean numeric, String numberOrText) {
        static final SheetCell EMPTY = new SheetCell("", false, false, "");

        static SheetCell ofText(String value) {
            String text = sanitizeText(value);
            return new SheetCell(text, false, false, text);
        }

        boolean isBlank() {
            return text.isBlank();
        }
    }

    private record RawRow(int rowNumber, Map<Integer, SheetCell> cells) {
        SheetCell get(int cellIndex) {
            return cells.getOrDefault(cellIndex, SheetCell.EMPTY);
        }

        boolean isBlank() {
            return cells.values().stream().allMatch(SheetCell::isBlank);
        }
    }

    private record SpreadsheetRow(int rowNumber, Map<StudentImportColumn, SheetCell> cells) {
        SheetCell get(StudentImportColumn column) {
            return cells.getOrDefault(column, SheetCell.EMPTY);
        }
    }

    private record SpreadsheetContent(List<SpreadsheetRow> rows, List<StudentImportErrorDto> headerErrors) {
    }

    private record CellError(StudentImportColumn column, String value, String message) {
    }

    private static final class RowErrors {
        private final SpreadsheetRow row;
        private final List<CellError> cellErrors = new ArrayList<>();

        RowErrors(SpreadsheetRow row) {
            this.row = row;
        }

        SpreadsheetRow row() {
            return row;
        }

        void add(StudentImportColumn column, SheetCell cell, String message) {
            cellErrors.add(new CellError(column, cell.text(), message));
        }

        boolean hasErrorIn(StudentImportColumn column) {
            return cellErrors.stream().anyMatch(error -> error.column() == column);
        }

        boolean isEmpty() {
            return cellErrors.isEmpty();
        }

        List<StudentImportErrorDto> toDtos() {
            return cellErrors.stream()
                    .sorted(Comparator.comparing(CellError::column))
                    .map(error -> new StudentImportErrorDto(
                            row.rowNumber(), error.column().getHeader(), error.value(), error.message()))
                    .toList();
        }
    }
}
