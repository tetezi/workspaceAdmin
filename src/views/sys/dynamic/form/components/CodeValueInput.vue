<template>
  <div style="width: 100%; display: flex; flex-wrap: wrap">
    <template v-if="isPrimitive">
      <div style="margin-right: 5px">
        <BasicButton icon="Refresh" size="small" circle :func="toggleType">
        </BasicButton>
      </div>
      <div style="flex: 1">
        <template v-if="modelValue?.type === 'value'">
          <Input
            v-if="props.expectedValueType === 'string'"
            v-model="modelValue.value"
          ></Input>
          <InputNumber
            v-else-if="props.expectedValueType === 'number'"
            v-model="modelValue.value"
          >
          </InputNumber>
          <Switch
            v-else-if="props.expectedValueType === 'boolean'"
            v-model="modelValue.value"
          ></Switch>
        </template>

        <template v-else-if="modelValue?.type === 'code'">
          <div
            style="
              border: 1px solid #ccc;
              width: 100%;
              display: block;
              padding: 5px;
              border-radius: 4px;
            "
          >
            <component :is="InjectParamsRender"></component>
            <AceEditor
              ref="AceEditorRef"
              style="height: 100px"
              v-model="modelValue.code"
              :placeholder="props.placeholderCode"
            >
            </AceEditor>
            <!-- } -->
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div
        style="
          border: 1px solid #ccc;
          width: 100%;
          display: block;
          padding: 5px;
          border-radius: 4px;
        "
      >
        <component :is="InjectParamsRender"></component>
        <AceEditor
          ref="AceEditorRef"
          style="height: 100px"
          v-model="modelValue"
          :placeholder="props.placeholderCode"
        ></AceEditor>
      </div>
    </template>
  </div>
</template>
<script lang="tsx" setup>
import { BasicButton, Input, InputNumber, Switch, AceEditor } from "ttz-ui";
import { computed, ref, unref } from "vue";
type Props = {
  expectedValueType:
    | "number"
    | "string"
    | "boolean"
    | "Recordable"
    | "VNodeChild"
    | "Function";
  defaultValue?: any;
  defaultCode?: string;
  placeholderCode?: string;
  renderParams: any[];
};
const AceEditorRef = ref<InstanceType<typeof AceEditor>>();
const props = defineProps<Props>();
const modelValue = defineModel<
  { type: "code"; code?: string } | { type: "value"; value?: any } | string
>() as any;

const isPrimitive = computed(() => {
  return (
    props.expectedValueType === "number" ||
    props.expectedValueType === "boolean" ||
    props.expectedValueType === "string"
  );
});
function setDefaultValue() {
  if (unref(isPrimitive)) {
    modelValue.value = {
      type: "value",
      value: props.defaultValue,
    };
  }
}
function setDefaultCode() {
  console.log("test", "setDefaultCode", unref(isPrimitive));
  if (unref(isPrimitive)) {
    modelValue.value = {
      type: "code",
      code: props.defaultCode,
    };
  } else {
    modelValue.value = props.defaultCode;
  }
}

function toggleType() {
  if (unref(isPrimitive)) {
    const type = unref(modelValue)?.type;
    if (type) {
      if (type === "value") {
        setDefaultCode();
      } else if (type === "code") {
        setDefaultValue();
      }
    } else {
      setDefaultValue();
    }
  }
}
const InjectParamsRender = computed(() => {
  type InjectParam = {
    label: string;
    code: string;
    p: string;
    children?: InjectParam[];
  };

  return (
    <el-popover width={250}>
      {{
        reference: () => <el-tag type="primary">renderParams</el-tag>,
        default: () => {
          return (
            <el-scrollbar height="300px">
              <el-tree
                data={props.renderParams}
                expand-on-click-node={false}
                onNode-click={(data: InjectParam) => {
                  unref(AceEditorRef)?.insert(data.code);
                }}
              >
                {{
                  default: ({ data }: { data: InjectParam }) => {
                    return (
                      <el-tooltip placement="right" effect="light">
                        {{
                          default: () => <el-text>{data.label}</el-text>,
                          content: () => (
                            <el-text>
                              <div>{data.p}</div>
                              <div>{data.code}</div>{" "}
                            </el-text>
                          ),
                        }}
                      </el-tooltip>
                    );
                  },
                }}
              </el-tree>
            </el-scrollbar>
          );
        },
      }}
    </el-popover>
  );
});
</script>
