include(FetchContent)

FetchContent_Declare(
  reactnative
  URL https://github.com/facebook/react-native/archive/f7e35d4ef7d68d06fba1439c0aa6d9ed05b58a7f.zip
  URL_HASH SHA256=9d639d90ae9d2d8748a6cd47d35e0c5bcee87721f918010e05a0a013b31dd087
)

FetchContent_GetProperties(reactnative)

if(NOT reactnative_POPULATED)
  FetchContent_Populate(reactnative)

  file(READ ${reactnative_SOURCE_DIR}/ReactCommon/jsinspector/InspectorInterfaces.h file_text)
  string(REPLACE
    "extern IInspector &getInspectorInstance"
    "extern __declspec(dllexport) IInspector& __cdecl getInspectorInstance"
    file_text
    "${file_text}"
  )
  file(WRITE ${reactnative_SOURCE_DIR}/ReactCommon/jsinspector/InspectorInterfaces.h "${file_text}")

  file(READ ${reactnative_SOURCE_DIR}/ReactCommon/hermes/inspector/chrome/Registration.h file_text)
  string(REPLACE
    "extern void enableDebugging"
    "extern __declspec(dllexport) void __cdecl enableDebugging"
    file_text
    "${file_text}"
  )
  string(REPLACE
    "extern void disableDebugging"
    "extern __declspec(dllexport) void __cdecl disableDebugging"
    file_text
    "${file_text}"
  )
  file(WRITE ${reactnative_SOURCE_DIR}/ReactCommon/hermes/inspector/chrome/Registration.h "${file_text}")

  file(GLOB_RECURSE YARN_FILES ${reactnative_SOURCE_DIR}/yarn.lock ${reactnative_SOURCE_DIR}/**/yarn.lock)
  message("Removing unused yarn.lock files: ${YARN_FILES}")
  if(YARN_FILES)
    file(REMOVE ${YARN_FILES})
  endif()

  file(GLOB_RECURSE GEMFILES ${reactnative_SOURCE_DIR}/Gemfile.lock ${reactnative_SOURCE_DIR}/**/Gemfile.lock)
  message("Removing unused Gemfile.lock files: ${GEMFILES}")
  if(GEMFILES)
    file(REMOVE ${GEMFILES})
  endif()
endif()

set(REACT_NATIVE_SOURCE ${reactnative_SOURCE_DIR} PARENT_SCOPE)
