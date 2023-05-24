// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

#include <gtest/gtest.h>
#include "hermes_api.h"
#include "napitest.h"

#include <memory>
#include <vector>

namespace napitest {

class HermesRuntimeHolder : public IEnvHolder {
 public:
  HermesRuntimeHolder() noexcept {
    jsr_config config{};
    jsr_create_config(&config);
    jsr_create_runtime(config, &runtime_);
    jsr_delete_config(config);
    jsr_runtime_get_node_api_env(runtime_, &env_);
  }

  ~HermesRuntimeHolder() {
    jsr_delete_runtime(runtime_);
  }

  HermesRuntimeHolder(const HermesRuntimeHolder &) = delete;
  HermesRuntimeHolder &operator=(const HermesRuntimeHolder &) = delete;

  napi_env getEnv() override {
    return env_;
  }

 private:
  jsr_runtime runtime_{};
  napi_env env_{};
};

std::vector<NapiTestData> NapiEnvFactories() {
  return {{"../js", [] {
             return std::unique_ptr<IEnvHolder>(new HermesRuntimeHolder());
           }}};
}

} // namespace napitest
