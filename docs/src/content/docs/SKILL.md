---
name: innospots-nexus-base
description: |
  Middleware-free pure Java foundation providing cross-cutting contracts and infrastructure for the Innospots Nexus platform.
  Capabilities include:
  - **Condition DSL**: Build filter/rule expressions with placeholder resolution, rendered to SQL or script strings with type-aware quoting
  - **Domain models**: User/role/group identity, organization/tenant, project scoping, dictionaries, field schemas with typed values
  - **Data contracts**: Generic request/response/page payloads with auto-timing, schema metadata, and pagination validation
  - **Event system**: Lightweight in-memory event bus with type-safe subscribe/publish for domain events
  - **Execution framework**: Executor SPI with context propagation, lifecycle status tracking, and execution records
  - **I18n**: Thread-local locale resolution, key-based message lookup, multi-locale value objects with fallback chains
  - **JSON utilities**: Jackson facade with field-level masking (phone, email, ID card, password) and custom value conversion via annotations
  - **Status codes**: Platform-wide bilingual error codes with category, priority, HTTP status mapping, and format validation
  - **Concurrency**: Thread-local context (TLC) for trace/tenant/user propagation across async boundaries, named thread pools
  - **Crypto**: BCrypt password hashing, AES-GCM symmetric encryption, RSA-OAEP asymmetric encryption with block-mode support
  - **Resources**: File storage SPI for pluggable backends (local, S3, OSS) with metadata tracking
  - **HTTP**: Apache HttpClient5 builder with pooling and convenience GET/POST utilities
  - **UI descriptors**: Dynamic page/component models with conditional visibility for configurable UIs
  - **ID generation**: Snowflake distributed IDs, prefixed ULIDs, random/timestamped IDs with configurable character sets
  - **Metrics**: Micrometer counters, timers, gauges with auto name normalization
  - **Bean/Date/String utils**: Property copying, multi-pattern datetime parsing, placeholder replacement
version: 1.0.0
---

# innospots-nexus-base

## Module Overview

`innospots-nexus-base` is the middleware-free foundation layer for the Innospots Nexus platform.
It provides all cross-cutting interfaces, domain primitives, and utilities that other modules
depend on, with zero infrastructure bindings (no Spring, no Servlet, no database driver).

**What it can do:**

| Capability | Description |
|------------|-------------|
| **Condition Engine** | Build filter/rule conditions with typed factors, operators (EQ/IN/BETWEEN/LIKE/NULL), placeholder resolution (`${key}`), and render to SQL or script expressions |
| **Identity & Access** | Model users, roles, groups, organizations, and projects with status and visibility control |
| **Data Exchange** | Generic request/response/page payloads with schema metadata, auto-timing, and pagination |
| **Event-Driven** | Publish/subscribe domain events in-process with synchronous and fire-and-forget dispatch |
| **Execution** | SPI for executable units with context propagation, lifecycle tracking, and result recording |
| **Internationalization** | Thread-safe locale resolution, `${key}` message lookup, multi-locale value maps with fallback |
| **Sensitive Data** | Jackson field masking (phone, email, ID card, password) and custom value transformation via annotations |
| **Error Codes** | Bilingual status codes with category, priority, HTTP mapping, and format validation (`NEX+category+local`) |
| **Async Context** | Thread-local trace/tenant/user propagation with snapshot/restore and auto-cleanup Scope |
| **Cryptography** | BCrypt passwords, AES-GCM symmetric encryption, RSA-OAEP asymmetric encryption with block-mode |
| **File Storage** | Pluggable resource store SPI for save/read/delete with metadata tracking |
| **HTTP Client** | Apache HttpClient5 builder with pooling, timeouts, and convenience GET/POST utilities |
| **UI Descriptors** | Dynamic page/component models with conditional visibility for configurable frontends |
| **ID Generation** | Snowflake distributed IDs, prefixed ULIDs, random/timestamped IDs with configurable charset (numeric, hex, alphanumeric) |
| **Metrics** | Micrometer counters, timers, gauges with auto name normalization and success/failure tracking |
| **Utilities** | Bean copy, multi-pattern datetime parsing, environment resolution, string placeholder replacement |

**Package layout by responsibility:**

| Package | Purpose |
|---------|---------|
| `config` | Immutable flat configuration store |
| `domain.condition` | DSL for building filter/condition expressions (SQL or script) |
| `domain.data` | Data operation contracts (request, response, page, schema, body) |
| `domain.dictionary` | Dictionary item/type with i18n support |
| `domain.enums` | Shared domain enums (BasicStatus, Visibility) |
| `domain.field` | Field metadata model (DomainField, ParamField, FieldValueType) |
| `domain.identity` | User, role, and user-group identity models |
| `domain.organization` | Organization/tenant model |
| `domain.project` | Project model with organization scoping |
| `domain.response` | Generic API response wrappers (R, PageResult) |
| `events` | In-memory domain event bus |
| `exception` | Base runtime exception |
| `execution` | Execution context, record, status, and executor SPI |
| `http` | Apache HttpClient5 builder and convenience utils |
| `i18n` | Internationalization converter, object, message resolver |
| `json` | Jackson JSON facade with masking and value conversion |
| `mapstruct` | MapStruct base mapper interfaces and support |
| `resources` | Resource/File storage abstraction |
| `status` | Status code system (module, category, local code) |
| `thread` | Thread-local context (TLC), async executors, thread pool |
| `ui` | Dynamic UI component/page/resource descriptors |
| `util` | General utilities (crypto, date, bean, env, ID gen, metrics, string) |

## Class Reference

### Package `config`

| Class | Type | Description |
|-------|------|-------------|
| `NexusConfig` | `final class` | Immutable key-value config store with typed accessors (`getBoolean`, `getInt`). Null values skipped at construction. |

### Package `domain.condition`

| Class | Type | Description |
|-------|------|-------------|
| `Mode` | `enum` | Target output mode: `DB` (SQL), `SCRIPT` (expression language), `JAVA` (same as SCRIPT) |
| `Relation` | `enum` | Logical combinators: `AND`, `OR`, each with DB and script symbols |
| `Operator` | `enum` | Comparison operators (EQ, NEQ, GT, GTE, LT, LTE, IN, NOT_IN, LIKE, IS_NULL, IS_NOT_NULL, BETWEEN, HAS_VALUE) with dual DB/script symbols |
| `Factor` | `class` | A single filter criterion: `(code, operator, value, valueType)`. Supports `${...}` / `%{...}` placeholder resolution via `value(Map)` |
| `IFactorStatement` | `interface` | Strategy for rendering a Factor into a mode-specific expression string |
| `FactorStatementBuilder` | `final class` | Factory selecting `DatabaseFactorStatement` or `ScriptFactorStatement` by Mode |
| `DatabaseFactorStatement` | `class` | Renders Factor as SQL expression with type-aware quoting (ISO date format, single-quoted strings with stripped apostrophes) |
| `ScriptFactorStatement` | `class` | Renders Factor as script expression using `include()`, `notInclude()`, `regexMatch()` helpers |
| `SimpleCondition` | `class` | Flat list of Factors joined by a single Relation, with lazy statement generation and caching |
| `EmbedCondition` | `class` | Extends SimpleCondition with nested sub-conditions wrapped in parentheses |

### Package `domain.data`

| Class | Type | Description |
|-------|------|-------------|
| `DataOperation` | `enum` | CRUD + EXECUTE operation types |
| `DataBody` | `class` | Self-timing payload wrapper with schema, message, meta, and elapsed millis |
| `DataPage` | `record` | Immutable paginated data container with validations and navigation helpers |
| `DataRequest` | `class` | Generic data operation request with target, body, pagination, query, and credential key |
| `DataResponse` | `class` | Success/failure response envelope with schema and meta |
| `DataSchema` | `class` | Field schema definition with configurable properties |

### Package `domain.request`

| Class | Type | Description |
|-------|------|-------------|
| `SimpleQueryRequest` | `record` | Paginated query request with keyword, page number, and page size. |

### Package `domain.dictionary`

| Class | Type | Description |
|-------|------|-------------|
| `DictionaryType` | `record` | Dictionary type code with i18n name and status |
| `DictionaryItem` | `record` | A single dictionary entry with value, i18n name, type reference, and status |

### Package `domain.enums`

| Class | Type | Description |
|-------|------|-------------|
| `BasicStatus` | `enum` | Universal enable/disable status: `ENABLED`, `DISABLED` |
| `Visibility` | `enum` | Visibility scope: `PRIVATE`, `ORGANIZATION`, `PROJECT`, `PUBLIC` |

### Package `domain.field`

| Class | Type | Description |
|-------|------|-------------|
| `FieldScope` | `enum` | Field role: `INPUT`, `OUTPUT`, `PARAMETER`, `METADATA` |
| `FieldValueType` | `enum` | Typed values (STRING, INTEGER, LONG, DOUBLE, DECIMAL, BOOLEAN, DATE, TIME, DATE_TIME, OBJECT, ARRAY) with Java type mapping and `convert()` coercion |
| `DomainField` | `class` | Schema field descriptor with ID, name, code, value type, scope, comment, and selectable options |
| `ParamField` | `class` | Parameter field extending DomainField with required flag, default value, and typed FieldValueType |
| `SelectOption` | `record` | A selectable option with value and display label |

### Package `domain.identity`

| Class | Type | Description |
|-------|------|-------------|
| `UserInfo` | `class` | Core user model with immutable identity (userId, userName, realName) and mutable attributes (email, avatar, group, roles) |
| `UserGroupInfo` | `record` | User group/team with parent hierarchy, head user, and assistant users |
| `RoleInfo` | `record` | Role definition with ID, name, code, and status |

### Package `domain.organization`

| Class | Type | Description |
|-------|------|-------------|
| `OrganizationInfo` | `record` | Organization/tenant with locale, currency, logo, and status |

### Package `domain.project`

| Class | Type | Description |
|-------|------|-------------|
| `ProjectInfo` | `class` | Project within an organization, scoping workflows and resources |

### Package `domain.response`

| Class | Type | Description |
|-------|------|-------------|
| `R` | `record` | Generic API response with success flag, code, message, and optional data |
| `PageResult` | `record` | Paginated API response with auto-calculated page count and navigation helpers |

### Package `events`

| Class | Type | Description |
|-------|------|-------------|
| `DomainEvent` | `interface` | Base event interface with auto-generated UUID eventId and Instant timestamp |
| `EventHandler` | `@FunctionalInterface` | Event handler that processes a typed domain event |
| `EventBus` | `final class` | Simple in-memory event bus with subscribe/unsubscribe/publish/publishSync, thread-safe via CopyOnWriteArrayList |

### Package `exception`

| Class | Type | Description |
|-------|------|-------------|
| `NexusException` | `class` | Base runtime exception with machine-readable code (StatusCode compatible) and human-readable message |

### Package `execution`

| Class | Type | Description |
|-------|------|-------------|
| `ExecutionStatus` | `enum` | Lifecycle states: CREATED → STARTING → READY → PENDING → RUNNING → STOPPING → STOPPED → SUCCESS/FAILED |
| `Executor` | `interface` | SPI for execution units with identifier and execute(context) contract |
| `ExecutionContext` | `class` | Per-run context with immutable inputs and mutable working memory, typed accessors |
| `ExecutionRecord` | `class` | Immutable record of a completed execution capturing status, timing, context, output, and message |

### Package `http`

| Class | Type | Description |
|-------|------|-------------|
| `HttpClientBuilder` | `final class` | Fluent builder for CloseableHttpClient (10s connect, 30s response, redirects enabled by default) |
| `HttpResult` | `record` | Immutable HTTP response (status, reason, body, headers) with `isSuccessful()` convenience |
| `HttpUtils` | `final class` | Convenience methods for HTTP GET and POST (JSON) |

### Package `i18n`

| Class | Type | Description |
|-------|------|-------------|
| `I18n` | `@interface` | Jackson annotation marking fields for automatic i18n serialization |
| `I18nConverter` | `final class` | Core i18n engine: `${key}` resolution via I18nMessageResolver, I18nObject locale lookup, thread-local locale |
| `I18nMessageResolver` | `@FunctionalInterface` | Strategy for resolving i18n keys to localized messages |
| `I18nObject` | `class` | Locale→value map extending LinkedHashMap, with fallback chain: exact match → language-only → locale group → first value |

### Package `json`

| Class | Type | Description |
|-------|------|-------------|
| `Jsons` | `final class` | Central Jackson facade with default mapper and masked mapper (MaskingModule registered); supports toJson/fromJson/fromJsonList/fromJsonSet/toMap |
| `MaskStrategy` | `enum` | Predefined masking strategies: PHONE, EMAIL, ID_CARD, BANK_CARD, NAME, PASSWORD, HIDE, CUSTOM |
| `MaskValue` | `@interface` | Jackson annotation for field-level masking with configurable strategy and keepHead/keepTail |
| `MaskedSerializer` | `class` | Jackson StdSerializer applying MaskValue configuration |
| `ValueConverter` | `@interface` | Jackson annotation for field-level value transformation via a Function class |
| `ValueConvertingSerializer` | `class` | Jackson StdSerializer that applies ValueConverter, optionally delegating to a secondary serializer (e.g. masking) |
| `MaskingModule` | `final class` | Jackson Module that wires MaskedSerializer and ValueConvertingSerializer via BeanSerializerModifier |

### Package `mapstruct`

| Class | Type | Description |
|-------|------|-------------|
| `BaseMapperConfig` | `interface` | Shared MapStruct config: accessor-only collection mapping, always-on null checks, ignore unmapped targets |
| `BaseMapperSupport` | `final class` | Utility for mapping collections via a mapping function |
| `BaseBeanConverter` | `interface` | Base converter between Model and Entity with default JSON/date conversion methods |

### Package `resources`

| Class | Type | Description |
|-------|------|-------------|
| `FileResource` | `record` | File input with name, content type, InputStream, and meta-save flag |
| `MetaResource` | `record` | Immutable stored resource metadata (ID, name, MIME, module, size, URI, store mode, timestamp) |
| `ResourceEvent` | `record` | Domain event published when resource metadata is saved (`resource.meta.saved`) |
| `ResourceStore` | `interface` | SPI for binary resource persistence (save/read/delete/exists) |
| `ResourcePatternResolver` | `class` | Ant-style classpath resource scanner supporting `classpath*:` and `classpath:` prefixes; returns `Resource` or `MatchedResource` with matched path info |

### Package `status`

| Class | Type | Description |
|-------|------|-------------|
| `StatusCategory` | `enum` | Status code categories (21 categories) with 2-digit code and priority (L/M/H/B/C) |
| `StatusCode` | `interface` | Composable status code SPI: module(3) + category(2) + local(4) = fullCode, with bilingual message+advice |
| `StatusCodeRules` | `final class` | Validation: module must be 3 uppercase letters, category non-null, local code 4 digits |
| `NexusStatusCode` | `enum` | Platform status codes (18 codes: SUCCESS through SYSTEM_ERROR) with EN/ZH messages and advice |

### Package `thread`

| Class | Type | Description |
|-------|------|-------------|
| `TLC` | `final class` | Thread-Local Context map with typed keys (traceId, tenantId, userId, etc.), snapshot/restore, and try-with-resources Scope |
| `NexusThreadFactory` | `class` | Named ThreadFactory with sequence-numbered threads (default prefix: `nexus-worker`) |
| `NexusThreadPoolExecutor` | `class` | ThreadPoolExecutor that captures and propagates TLC context across async boundaries |
| `ThreadPoolBuilder` | `final class` | Fluent builder for NexusThreadPoolExecutor (defaults: core=processors, queue=20k, keep-alive=120s, caller-runs) |
| `AsyncExecutors` | `final class` | Global async executor facade with lazy initialization via ThreadPoolBuilder |

### Package `ui`

| Class | Type | Description |
|-------|------|-------------|
| `UiComponent` | `class` | Configurable UI component descriptor with ID, type, value type, settings, layout, and visibility conditions |
| `UiCondition` | `class` | Visibility/enablement condition using Factor and Relation |
| `UiPage` | `class` | Dynamic page definition with components map, navigation and homepage flags |
| `UiResource` | `class` | Multi-page UI resource aggregate (pages + schemas) |

### Package `util`

| Class | Type | Description |
|-------|------|-------------|
| `BeanUtils` | `final class` | Bean copy/conversion wrapping Hutool: copyProperties, toMap, toBean with camelCase support |
| `CryptoUtils` | `final class` | Crypto: SHA-256, BCrypt salt generation/password hash/verify, AES-GCM encrypt/decrypt (random IV prepended), RSA-OAEP key pair gen/encrypt/decrypt (block mode) |
| `DateTimeUtils` | `final class` | Date/time formatting and parsing with 12+ predefined patterns, ISO instant support, and multi-pattern fallback |
| `EnvUtils` | `final class` | Environment resolver with override support: overrides → system properties → env vars |
| `IdGenerator` | `final class` | ID generation: Snowflake distributed IDs, prefixed ULIDs, random IDs (4 charset types), timestamp-prefixed, batch generation |
| `MetricsSnapshot` | `record` | Point-in-time metrics snapshot: name, tags, count, totalNanos, totalMillis |
| `MetricsUtils` | `final class` | Micrometer facade: counters, timers, gauges with auto name normalization and success/failure/retry counting |
| `StringUtils` | `final class` | String utilities: blank checks, placeholder replacement (`${key}` / `{{key}}`), camelCase/underscore conversion, random key generation |

## References

Each package has a dedicated reference file in `references/` with detailed method-level documentation — signatures, parameters, return types, and descriptions — extracted directly from the source code.

To use: open a reference file when you need complete method-level API details for any class in a given package.

| Package | Reference File | Classes Covered |
|---------|---------------|-----------------|
| `config` | [`references/config.md`](references/config.md) | NexusConfig |
| `domain.condition` | [`references/domain-condition.md`](references/domain-condition.md) | Mode, Relation, Operator, Factor, IFactorStatement, FactorStatementBuilder, DatabaseFactorStatement, ScriptFactorStatement, SimpleCondition, EmbedCondition |
| `domain.data` | [`references/domain-data.md`](references/domain-data.md) | DataBody, DataOperation, DataPage, DataRequest, DataResponse, DataSchema |
| `domain.dictionary` | [`references/domain-dictionary.md`](references/domain-dictionary.md) | DictionaryItem, DictionaryType |
| `domain.enums` | [`references/domain-enums.md`](references/domain-enums.md) | BasicStatus, Visibility |
| `domain.field` | [`references/domain-field.md`](references/domain-field.md) | DomainField, ParamField, FieldScope, FieldValueType, SelectOption |
| `domain.identity` | [`references/domain-identity.md`](references/domain-identity.md) | UserInfo, UserGroupInfo, RoleInfo |
| `domain.organization` | [`references/domain-organization.md`](references/domain-organization.md) | OrganizationInfo |
| `domain.project` | [`references/domain-project.md`](references/domain-project.md) | ProjectInfo |
| `domain.response` | [`references/domain-response.md`](references/domain-response.md) | R, PageResult |
| `events` | [`references/events.md`](references/events.md) | DomainEvent, EventHandler, EventBus |
| `exception` | [`references/exception.md`](references/exception.md) | NexusException |
| `execution` | [`references/execution.md`](references/execution.md) | ExecutionStatus, Executor, ExecutionContext, ExecutionRecord |
| `http` | [`references/http.md`](references/http.md) | HttpClientBuilder, HttpResult, HttpUtils |
| `i18n` | [`references/i18n.md`](references/i18n.md) | I18n, I18nConverter, I18nMessageResolver, I18nObject |
| `json` | [`references/json.md`](references/json.md) | Jsons, MaskStrategy, MaskValue, MaskedSerializer, ValueConverter, ValueConvertingSerializer, MaskingModule |
| `mapstruct` | [`references/mapstruct.md`](references/mapstruct.md) | BaseMapperConfig, BaseMapperSupport, BaseBeanConverter |
| `resources` | [`references/resources.md`](references/resources.md) | FileResource, MetaResource, ResourceEvent, ResourceStore, ResourcePatternResolver |
| `status` | [`references/status.md`](references/status.md) | StatusCategory, StatusCode, StatusCodeRules, NexusStatusCode |
| `thread` | [`references/thread.md`](references/thread.md) | TLC, NexusThreadFactory, NexusThreadPoolExecutor, ThreadPoolBuilder, AsyncExecutors |
| `ui` | [`references/ui.md`](references/ui.md) | UiComponent, UiCondition, UiPage, UiResource |
| `domain.request` | [`references/domain-request.md`](references/domain-request.md) | SimpleQueryRequest |
| `util` | [`references/util.md`](references/util.md) | BeanUtils, CryptoUtils, DateTimeUtils, EnvUtils, IdGenerator, MetricsSnapshot, MetricsUtils, StringUtils |
