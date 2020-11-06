(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    var KNOWN_RUNTIMES = ['mono.dll', 'libmonosgen-2.0.so'];
    var KNOWN_EXPORTS = ['mono_thread_attach'];
    var KNOWN_STRINGS = ["'%s' in MONO_PATH doesn't exist or has wrong permissions"];
    /**
     * To work with mono we need the mono module thats loaded in the current process.
     * This function tries to find it using 3 methods.
     * - Find by module name
     * - Find by export function names
     * - Find by strings in memory
     */
    function findMonoModule() {
        for (var _i = 0, KNOWN_RUNTIMES_1 = KNOWN_RUNTIMES; _i < KNOWN_RUNTIMES_1.length; _i++) {
            var runtime = KNOWN_RUNTIMES_1[_i];
            var module = Process.findModuleByName(runtime);
            if (module)
                return module;
        }
        for (var _a = 0, KNOWN_EXPORTS_1 = KNOWN_EXPORTS; _a < KNOWN_EXPORTS_1.length; _a++) {
            var exportName = KNOWN_EXPORTS_1[_a];
            var exportFunction = Module.findExportByName(null, exportName);
            if (exportFunction)
                return Process.findModuleByAddress(exportFunction);
        }
        var allModules = Process.enumerateModules();
        for (var _b = 0, allModules_1 = allModules; _b < allModules_1.length; _b++) {
            var module = allModules_1[_b];
            for (var _c = 0, KNOWN_STRINGS_1 = KNOWN_STRINGS; _c < KNOWN_STRINGS_1.length; _c++) {
                var string = KNOWN_STRINGS_1[_c];
                var pattern = string.split('').map(function (e) { return ('0' + e.charCodeAt(0).toString(16)).slice(-2); }).join(' ');
                var matches = Memory.scanSync(module.base, module.size, pattern);
                if (matches.length > 0) {
                    return Process.findModuleByAddress(matches[0].address);
                }
            }
        }
        throw new Error('Failed finding the mono module!');
    }
    var module = findMonoModule();

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /**
     * This is just to make it convinient to use NativeFunctions.
     * Otherwise we would have to store the informations somewhere else.
     * This way its attached to the NativeFunction. Awesome!
     */
    var ExNativeFunction = /** @class */ (function (_super) {
        __extends(ExNativeFunction, _super);
        function ExNativeFunction(address, retType, argTypes, abiOrOptions) {
            if (retType === void 0) { retType = 'void'; }
            if (argTypes === void 0) { argTypes = []; }
            if (abiOrOptions === void 0) { abiOrOptions = 'default'; }
            var _this = _super.call(this) || this;
            _this.abi = 'default';
            var native = new NativeFunction(address, retType, argTypes, abiOrOptions);
            _this.address = address;
            _this.retType = retType;
            _this.argTypes = argTypes;
            if (typeof abiOrOptions === 'string') {
                _this.abi = abiOrOptions;
            }
            else if (typeof abiOrOptions === 'object') {
                _this.abi = abiOrOptions.abi || 'default';
                _this.options = abiOrOptions;
            }
            Object.assign(native, _this);
            return native;
        }
        ExNativeFunction.prototype.nativeCallback = function (callback) {
            return new NativeCallback(callback, this.retType, this.argTypes, this.abi);
        };
        ExNativeFunction.prototype.intercept = function (callbacksOrProbe, data) {
            return Interceptor.attach(this.address, callbacksOrProbe, data);
        };
        ExNativeFunction.prototype.replace = function (replacement, data) {
            return Interceptor.replace(this.address, replacement, data);
        };
        return ExNativeFunction;
    }(Function));

    var NATIVE_SIGNATURES$1 = {
        g_free: null,
        mono_add_internal_call: null,
        mono_alloc_special_static_data: null,
        mono_array_addr_with_size: ['pointer', ['pointer', 'int', 'uint32']],
        mono_array_class_get: null,
        mono_array_clone: null,
        mono_array_element_size: null,
        mono_array_length: ['uint32', ['pointer']],
        mono_array_new: null,
        mono_array_new_full: null,
        mono_array_new_specific: null,
        mono_assemblies_cleanup: null,
        mono_assemblies_init: null,
        mono_assembly_close: null,
        mono_assembly_fill_assembly_name: null,
        mono_assembly_foreach: ['int', ['pointer', 'pointer']],
        mono_assembly_get_assemblyref: null,
        mono_assembly_get_image: ['pointer', ['pointer']],
        mono_assembly_get_main: null,
        mono_assembly_get_object: null,
        mono_assembly_getrootdir: null,
        mono_assembly_invoke_load_hook: null,
        mono_assembly_invoke_search_hook: null,
        mono_assembly_load: null,
        mono_assembly_load_from: null,
        mono_assembly_load_from_full: ['pointer', ['pointer', 'pointer', 'pointer', 'uchar']],
        mono_assembly_load_full: null,
        mono_assembly_load_module: null,
        mono_assembly_load_reference: null,
        mono_assembly_load_references: null,
        mono_assembly_load_with_partial_name: ['pointer', ['pointer', 'pointer']],
        mono_assembly_loaded: null,
        mono_assembly_loaded_full: null,
        mono_assembly_name_parse: null,
        mono_assembly_names_equal: null,
        mono_assembly_open: null,
        mono_assembly_open_full: null,
        mono_assembly_set_main: null,
        mono_assembly_setrootdir: null,
        mono_aot_get_method: ['pointer', ['pointer', 'pointer', 'pointer']],
        mono_backtrace_from_context: null,
        mono_bitset_alloc_size: null,
        mono_bitset_clear: null,
        mono_bitset_clear_all: null,
        mono_bitset_clone: null,
        mono_bitset_copyto: null,
        mono_bitset_count: null,
        mono_bitset_equal: null,
        mono_bitset_find_first: null,
        mono_bitset_find_first_unset: null,
        mono_bitset_find_last: null,
        mono_bitset_find_start: null,
        mono_bitset_foreach: null,
        mono_bitset_free: null,
        mono_bitset_intersection: null,
        mono_bitset_intersection_2: null,
        mono_bitset_invert: null,
        mono_bitset_mem_new: null,
        mono_bitset_new: null,
        mono_bitset_set: null,
        mono_bitset_set_all: null,
        mono_bitset_size: null,
        mono_bitset_sub: null,
        mono_bitset_test: null,
        mono_bitset_test_bulk: null,
        mono_bitset_union: null,
        mono_bounded_array_class_get: null,
        mono_check_corlib_version: null,
        mono_class_array_element_size: null,
        mono_class_data_size: null,
        mono_class_describe_statics: null,
        mono_class_enum_basetype: ['pointer', ['pointer']],
        mono_class_from_generic_parameter: null,
        mono_class_from_mono_type: ['pointer', ['pointer']],
        mono_class_from_name: ['pointer', ['pointer', 'pointer', 'pointer']],
        mono_class_from_name_case: null,
        mono_class_from_typeref: null,
        mono_class_get: ['pointer', ['pointer', 'uint32']],
        mono_class_get_byref_type: null,
        mono_class_get_element_class: null,
        mono_class_get_event_token: null,
        mono_class_get_events: null,
        mono_class_get_field: null,
        mono_class_get_field_from_name: ['pointer', ['pointer', 'pointer']],
        mono_class_get_field_token: null,
        mono_class_get_fields: ['pointer', ['pointer', 'pointer']],
        mono_class_get_flags: null,
        mono_class_get_full: null,
        mono_class_get_image: null,
        mono_class_get_interfaces: null,
        mono_class_get_method_from_name: ['pointer', ['pointer', 'pointer', 'int']],
        mono_class_get_method_from_name_flags: null,
        mono_class_get_methods: ['pointer', ['pointer', 'pointer']],
        mono_class_get_name: ['pointer', ['pointer']],
        mono_class_get_namespace: ['pointer', ['pointer']],
        mono_class_get_nested_types: null,
        mono_class_get_nesting_type: null,
        mono_class_get_parent: ['pointer', ['pointer']],
        mono_class_get_properties: null,
        mono_class_get_property_from_name: ['pointer', ['pointer', 'pointer']],
        mono_class_get_property_token: null,
        mono_class_get_rank: null,
        mono_class_get_type: ['pointer', ['pointer']],
        mono_class_get_type_token: null,
        mono_class_get_userdata: null,
        mono_class_get_userdata_offset: null,
        mono_class_inflate_generic_method: null,
        mono_class_inflate_generic_method_full: null,
        mono_class_inflate_generic_type: null,
        mono_class_init: null,
        mono_class_instance_size: null,
        mono_class_is_assignable_from: null,
        mono_class_is_blittable: null,
        mono_class_is_enum: ['uchar', ['pointer']],
        mono_class_is_generic: null,
        mono_class_is_inflated: null,
        mono_class_is_subclass_of: null,
        mono_class_is_valuetype: null,
        mono_class_min_align: null,
        mono_class_name_from_token: null,
        mono_class_num_events: null,
        mono_class_num_fields: null,
        mono_class_num_methods: null,
        mono_class_num_properties: null,
        mono_class_set_userdata: null,
        mono_class_value_size: null,
        mono_class_vtable: null,
        mono_cli_rva_image_map: null,
        mono_code_manager_commit: null,
        mono_code_manager_destroy: null,
        mono_code_manager_foreach: null,
        mono_code_manager_invalidate: null,
        mono_code_manager_new: null,
        mono_code_manager_new_dynamic: null,
        mono_code_manager_reserve: null,
        mono_compile_method: ['pointer', ['pointer']],
        mono_config_for_assembly: null,
        mono_config_parse: null,
        mono_config_parse_memory: null,
        mono_config_string_for_assembly_file: null,
        mono_context_get: null,
        mono_context_init: null,
        mono_context_set: null,
        mono_counters_dump: null,
        mono_counters_enable: null,
        mono_counters_register: null,
        mono_custom_attrs_construct: null,
        mono_custom_attrs_free: null,
        mono_custom_attrs_from_assembly: null,
        mono_custom_attrs_from_class: null,
        mono_custom_attrs_from_event: null,
        mono_custom_attrs_from_field: null,
        mono_custom_attrs_from_index: null,
        mono_custom_attrs_from_method: null,
        mono_custom_attrs_from_param: null,
        mono_custom_attrs_from_property: null,
        mono_custom_attrs_get_attr: null,
        mono_custom_attrs_has_attr: null,
        mono_debug_add_method: null,
        mono_debug_cleanup: null,
        mono_debug_close_mono_symbol_file: null,
        mono_debug_domain_create: null,
        mono_debug_domain_unload: null,
        mono_debug_find_method: null,
        mono_debug_free_source_location: null,
        mono_debug_init: null,
        mono_debug_lookup_method: null,
        mono_debug_lookup_source_location: null,
        mono_debug_open_image_from_memory: null,
        mono_debug_open_mono_symbols: null,
        mono_debug_print_stack_frame: null,
        mono_debug_print_vars: null,
        mono_debug_symfile_lookup_location: null,
        mono_debug_symfile_lookup_method: null,
        mono_debug_using_mono_debugger: null,
        mono_debug_enabled: ['bool', []],
        mono_debugger_breakpoint_callback: null,
        mono_debugger_check_runtime_version: null,
        mono_debugger_cleanup: null,
        mono_debugger_event: null,
        mono_debugger_handle_exception: null,
        mono_debugger_initialize: null,
        mono_debugger_insert_breakpoint: null,
        mono_debugger_insert_breakpoint_full: null,
        mono_debugger_lock: null,
        mono_debugger_method_has_breakpoint: null,
        mono_debugger_remove_breakpoint: null,
        mono_debugger_run_finally: null,
        mono_debugger_unlock: null,
        mono_declsec_flags_from_assembly: null,
        mono_declsec_flags_from_class: null,
        mono_declsec_flags_from_method: null,
        mono_declsec_get_assembly_action: null,
        mono_declsec_get_class_action: null,
        mono_declsec_get_demands: null,
        mono_declsec_get_inheritdemands_class: null,
        mono_declsec_get_inheritdemands_method: null,
        mono_declsec_get_linkdemands: null,
        mono_declsec_get_method_action: null,
        mono_digest_get_public_token: null,
        mono_disasm_code: null,
        mono_disasm_code_one: null,
        mono_dl_fallback_register: null,
        mono_dl_fallback_unregister: null,
        mono_dllmap_insert: null,
        mono_domain_add_class_static_data: null,
        mono_domain_assembly_open: null,
        mono_domain_create: null,
        mono_domain_create_appdomain: null,
        mono_domain_finalize: null,
        mono_domain_foreach: ['void', ['pointer', 'pointer']],
        mono_domain_free: null,
        mono_domain_get: ['pointer'],
        mono_domain_get_by_id: null,
        mono_domain_get_id: null,
        mono_domain_has_type_resolve: null,
        mono_domain_is_unloading: null,
        mono_domain_owns_vtable_slot: null,
        mono_domain_set: null,
        mono_domain_set_internal: null,
        mono_domain_try_type_resolve: null,
        mono_domain_unload: null,
        mono_environment_exitcode_get: null,
        mono_environment_exitcode_set: null,
        mono_escape_uri_string: null,
        mono_event_get_add_method: null,
        mono_event_get_flags: null,
        mono_event_get_name: null,
        mono_event_get_object: null,
        mono_event_get_parent: null,
        mono_event_get_raise_method: null,
        mono_event_get_remove_method: null,
        mono_exception_from_name: null,
        mono_exception_from_name_domain: null,
        mono_exception_from_name_msg: null,
        mono_exception_from_name_two_strings: null,
        mono_exception_from_token: null,
        mono_field_from_token: null,
        mono_field_get_data: null,
        mono_field_get_flags: ['uint', ['pointer']],
        mono_field_get_name: ['pointer', ['pointer']],
        mono_field_get_object: null,
        mono_field_get_offset: null,
        mono_field_get_parent: null,
        mono_field_get_type: ['pointer', ['pointer']],
        mono_field_get_value: ['void', ['pointer', 'pointer', 'pointer']],
        mono_field_get_value_object: ['pointer', ['pointer', 'pointer', 'pointer']],
        mono_field_set_value: ['void', ['pointer', 'pointer', 'pointer']],
        mono_field_static_get_value: null,
        mono_field_static_set_value: null,
        mono_file_map: null,
        mono_file_unmap: null,
        mono_free_method: null,
        mono_free_verify_list: null,
        mono_g_hash_table_destroy: null,
        mono_g_hash_table_foreach: null,
        mono_g_hash_table_foreach_remove: null,
        mono_g_hash_table_insert: null,
        mono_g_hash_table_lookup: null,
        mono_g_hash_table_lookup_extended: null,
        mono_g_hash_table_new: null,
        mono_g_hash_table_new_full: null,
        mono_g_hash_table_new_type: null,
        mono_g_hash_table_remove: null,
        mono_g_hash_table_replace: null,
        mono_g_hash_table_size: null,
        mono_gc_collect: null,
        mono_gc_collection_count: null,
        mono_gc_enable_events: null,
        mono_gc_get_generation: null,
        mono_gc_get_heap_size: null,
        mono_gc_get_used_size: null,
        mono_gc_is_finalizer_thread: null,
        mono_gc_max_generation: null,
        mono_gc_out_of_memory: null,
        mono_gc_wbarrier_arrayref_copy: null,
        mono_gc_wbarrier_generic_store: null,
        mono_gc_wbarrier_set_arrayref: null,
        mono_gc_wbarrier_set_field: null,
        mono_gc_wbarrier_value_copy: null,
        mono_gchandle_free: null,
        mono_gchandle_get_target: null,
        mono_gchandle_is_in_domain: null,
        mono_gchandle_new: null,
        mono_gchandle_new_weakref: null,
        mono_get_array_class: null,
        mono_get_boolean_class: ['pointer'],
        mono_get_byte_class: null,
        mono_get_char_class: null,
        mono_get_config_dir: null,
        mono_get_corlib: null,
        mono_get_dbnull_object: null,
        mono_get_delegate_invoke: null,
        mono_get_double_class: null,
        mono_get_enum_class: null,
        mono_get_exception_appdomain_unloaded: null,
        mono_get_exception_argument: null,
        mono_get_exception_argument_null: null,
        mono_get_exception_argument_out_of_range: null,
        mono_get_exception_arithmetic: null,
        mono_get_exception_array_type_mismatch: null,
        mono_get_exception_bad_image_format: null,
        mono_get_exception_bad_image_format2: null,
        mono_get_exception_cannot_unload_appdomain: null,
        mono_get_exception_class: null,
        mono_get_exception_divide_by_zero: null,
        mono_get_exception_execution_engine: null,
        mono_get_exception_file_not_found: null,
        mono_get_exception_file_not_found2: null,
        mono_get_exception_index_out_of_range: null,
        mono_get_exception_invalid_cast: null,
        mono_get_exception_invalid_operation: null,
        mono_get_exception_io: null,
        mono_get_exception_missing_field: null,
        mono_get_exception_missing_method: null,
        mono_get_exception_not_implemented: null,
        mono_get_exception_not_supported: null,
        mono_get_exception_null_reference: null,
        mono_get_exception_overflow: null,
        mono_get_exception_reflection_type_load: null,
        mono_get_exception_security: null,
        mono_get_exception_serialization: null,
        mono_get_exception_stack_overflow: null,
        mono_get_exception_synchronization_lock: null,
        mono_get_exception_thread_abort: null,
        mono_get_exception_thread_interrupted: null,
        mono_get_exception_thread_state: null,
        mono_get_exception_type_initialization: null,
        mono_get_exception_type_load: null,
        mono_get_inflated_method: null,
        mono_get_int16_class: null,
        mono_get_int32_class: ['pointer'],
        mono_get_int64_class: null,
        mono_get_intptr_class: null,
        mono_get_machine_config: null,
        mono_get_method: null,
        mono_get_method_constrained: null,
        mono_get_method_full: null,
        mono_get_object_class: null,
        mono_get_root_domain: ['pointer'],
        mono_get_sbyte_class: null,
        mono_get_single_class: ['pointer'],
        mono_get_special_static_data: null,
        mono_get_string_class: ['pointer'],
        mono_get_thread_class: null,
        mono_get_uint16_class: null,
        mono_get_uint32_class: ['pointer'],
        mono_get_uint64_class: null,
        mono_get_uintptr_class: null,
        mono_get_void_class: null,
        mono_guid_to_string: null,
        mono_image_add_to_name_cache: null,
        mono_image_addref: null,
        mono_image_close: null,
        mono_image_ensure_section: null,
        mono_image_ensure_section_idx: null,
        mono_image_get_assembly: null,
        mono_image_get_entry_point: null,
        mono_image_get_filename: ['pointer', ['pointer']],
        mono_image_get_guid: null,
        mono_image_get_name: ['pointer', ['pointer']],
        mono_image_get_public_key: null,
        mono_image_get_resource: null,
        mono_image_get_strong_name: null,
        mono_image_get_table_info: ['pointer', ['pointer', 'int']],
        mono_image_get_table_rows: null,
        mono_image_has_authenticode_entry: null,
        mono_image_init: null,
        mono_image_init_name_cache: null,
        mono_image_is_dynamic: null,
        mono_image_load_file_for_image: null,
        mono_image_loaded: ['pointer', ['pointer']],
        mono_image_loaded_by_guid: null,
        mono_image_loaded_by_guid_full: null,
        mono_image_loaded_full: null,
        mono_image_lookup_resource: null,
        mono_image_open: null,
        mono_image_open_from_data: null,
        mono_image_open_from_data_full: null,
        mono_image_open_from_data_with_name: null,
        mono_image_open_full: null,
        mono_image_rva_map: null,
        mono_image_strerror: null,
        mono_image_strong_name_position: null,
        mono_image_verify_tables: null,
        mono_images_cleanup: null,
        mono_images_init: null,
        mono_init: null,
        mono_init_from_assembly: null,
        mono_init_version: null,
        mono_inst_name: null,
        mono_install_assembly_load_hook: null,
        mono_install_assembly_postload_refonly_search_hook: null,
        mono_install_assembly_postload_search_hook: null,
        mono_install_assembly_preload_hook: null,
        mono_install_assembly_refonly_preload_hook: null,
        mono_install_assembly_refonly_search_hook: null,
        mono_install_assembly_search_hook: null,
        mono_install_runtime_cleanup: null,
        mono_is_debugger_attached: null,
        mono_jit_cleanup: null,
        mono_jit_exec: null,
        mono_jit_info_get_code_size: null,
        mono_jit_info_get_code_start: null,
        mono_jit_info_get_method: null,
        mono_jit_info_table_find: null,
        mono_jit_init: null,
        mono_jit_init_version: null,
        mono_jit_parse_options: null,
        mono_jit_set_trace_options: null,
        mono_jit_thread_attach: null,
        mono_ldstr: null,
        mono_ldtoken: null,
        mono_load_remote_field: null,
        mono_load_remote_field_new: null,
        mono_loader_error_prepare_exception: null,
        mono_loader_get_last_error: null,
        mono_locks_dump: null,
        mono_lookup_internal_call: null,
        mono_lookup_pinvoke_call: null,
        mono_main: null,
        mono_marshal_string_to_utf16: null,
        mono_mb_free: null,
        mono_md5_final: null,
        mono_md5_get_digest: null,
        mono_md5_get_digest_from_file: null,
        mono_md5_init: null,
        mono_md5_update: null,
        mono_mempool_alloc: null,
        mono_mempool_alloc0: null,
        mono_mempool_contains_addr: null,
        mono_mempool_destroy: null,
        mono_mempool_empty: null,
        mono_mempool_get_allocated: null,
        mono_mempool_invalidate: null,
        mono_mempool_new: null,
        mono_mempool_stats: null,
        mono_mempool_strdup: null,
        mono_metadata_blob_heap: null,
        mono_metadata_cleanup: null,
        mono_metadata_compute_size: null,
        mono_metadata_custom_attrs_from_index: null,
        mono_metadata_declsec_from_index: null,
        mono_metadata_decode_blob_size: null,
        mono_metadata_decode_row: null,
        mono_metadata_decode_row_col: null,
        mono_metadata_decode_signed_value: null,
        mono_metadata_decode_table_row: null,
        mono_metadata_decode_table_row_col: null,
        mono_metadata_decode_value: null,
        mono_metadata_encode_value: null,
        mono_metadata_events_from_typedef: null,
        mono_metadata_field_info: null,
        mono_metadata_free_array: null,
        mono_metadata_free_marshal_spec: null,
        mono_metadata_free_method_signature: null,
        mono_metadata_free_mh: null,
        mono_metadata_free_type: null,
        mono_metadata_generic_class_is_valuetype: null,
        mono_metadata_get_constant_index: null,
        mono_metadata_get_generic_param_row: null,
        mono_metadata_get_marshal_info: null,
        mono_metadata_get_param_attrs: null,
        mono_metadata_guid_heap: null,
        mono_metadata_implmap_from_method: null,
        mono_metadata_init: null,
        mono_metadata_interfaces_from_typedef: null,
        mono_metadata_load_generic_param_constraints: null,
        mono_metadata_load_generic_params: null,
        mono_metadata_locate: null,
        mono_metadata_locate_token: null,
        mono_metadata_methods_from_event: null,
        mono_metadata_methods_from_property: null,
        mono_metadata_nested_in_typedef: null,
        mono_metadata_nesting_typedef: null,
        mono_metadata_packing_from_typedef: null,
        mono_metadata_parse_array: null,
        mono_metadata_parse_custom_mod: null,
        mono_metadata_parse_field_type: null,
        mono_metadata_parse_marshal_spec: null,
        mono_metadata_parse_method_signature: null,
        mono_metadata_parse_method_signature_full: null,
        mono_metadata_parse_mh: null,
        mono_metadata_parse_mh_full: null,
        mono_metadata_parse_param: null,
        mono_metadata_parse_signature: null,
        mono_metadata_parse_type: null,
        mono_metadata_parse_type_full: null,
        mono_metadata_parse_typedef_or_ref: null,
        mono_metadata_properties_from_typedef: null,
        mono_metadata_signature_alloc: null,
        mono_metadata_signature_dup: null,
        mono_metadata_signature_equal: null,
        mono_metadata_string_heap: null,
        mono_metadata_token_from_dor: null,
        mono_metadata_translate_token_index: null,
        mono_metadata_type_equal: null,
        mono_metadata_type_hash: null,
        mono_metadata_typedef_from_field: null,
        mono_metadata_typedef_from_method: null,
        mono_metadata_user_string: null,
        mono_method_body_get_object: null,
        mono_method_desc_free: null,
        mono_method_desc_from_method: null,
        mono_method_desc_full_match: null,
        mono_method_desc_match: null,
        mono_method_desc_new: null,
        mono_method_desc_search_in_class: null,
        mono_method_desc_search_in_image: null,
        mono_method_full_name: null,
        mono_method_get_class: null,
        mono_method_get_flags: ['uint', ['pointer', 'uint']],
        mono_method_get_header: ['pointer', ['pointer']],
        mono_method_get_index: null,
        mono_method_get_last_managed: null,
        mono_method_get_marshal_info: null,
        mono_method_get_name: ['pointer', ['pointer']],
        mono_method_get_object: null,
        mono_method_get_param_names: null,
        mono_method_get_param_token: null,
        mono_method_get_signature: null,
        mono_method_get_signature_full: null,
        mono_method_get_token: null,
        mono_method_has_marshal_info: null,
        mono_method_header_get_clauses: null,
        mono_method_header_get_code: null,
        mono_method_header_get_locals: null,
        mono_method_header_get_num_clauses: null,
        mono_method_signature: ['pointer', ['pointer']],
        mono_method_verify: null,
        mono_mlist_alloc: null,
        mono_mlist_append: null,
        mono_mlist_get_data: null,
        mono_mlist_last: null,
        mono_mlist_length: null,
        mono_mlist_next: null,
        mono_mlist_prepend: null,
        mono_mlist_remove_item: null,
        mono_mlist_set_data: null,
        mono_module_file_get_object: null,
        mono_module_get_object: null,
        mono_monitor_enter: null,
        mono_monitor_exit: null,
        mono_monitor_try_enter: null,
        mono_mprotect: null,
        mono_object_castclass_mbyref: null,
        mono_object_clone: null,
        mono_object_describe: null,
        mono_object_describe_fields: null,
        mono_object_get_class: ['pointer', ['pointer']],
        mono_object_get_domain: null,
        mono_object_get_size: null,
        mono_object_get_virtual_method: ['pointer', ['pointer', 'pointer']],
        mono_object_hash: null,
        mono_object_is_alive: null,
        mono_object_isinst: null,
        mono_object_isinst_mbyref: null,
        mono_object_new: ['pointer', ['pointer', 'pointer']],
        mono_object_new_alloc_specific: null,
        mono_object_new_fast: null,
        mono_object_new_from_token: null,
        mono_object_new_specific: null,
        mono_object_unbox: ['pointer', ['pointer']],
        mono_object_to_string: ['pointer', ['pointer', 'pointer']],
        mono_opcode_name: null,
        mono_opcode_value: null,
        mono_pagesize: null,
        mono_param_get_objects: null,
        mono_parse_default_optimizations: null,
        mono_path_canonicalize: null,
        mono_path_resolve_symlinks: null,
        mono_pe_file_open: null,
        mono_pmip: null,
        mono_poll: null,
        mono_print_method_from_ip: null,
        mono_print_thread_dump: null,
        mono_print_unhandled_exception: null,
        mono_profiler_coverage_get: null,
        mono_profiler_get_events: null,
        mono_profiler_install: null,
        mono_profiler_install_allocation: null,
        mono_profiler_install_appdomain: null,
        mono_profiler_install_assembly: null,
        mono_profiler_install_class: null,
        mono_profiler_install_coverage_filter: null,
        mono_profiler_install_enter_leave: null,
        mono_profiler_install_exception: null,
        mono_profiler_install_gc: null,
        mono_profiler_install_jit_compile: null,
        mono_profiler_install_jit_end: null,
        mono_profiler_install_module: null,
        mono_profiler_install_statistical: null,
        mono_profiler_install_thread: null,
        mono_profiler_install_transition: null,
        mono_profiler_load: null,
        mono_profiler_set_events: null,
        mono_property_get_flags: null,
        mono_property_get_get_method: ['pointer', ['pointer']],
        mono_property_get_name: null,
        mono_property_get_object: null,
        mono_property_get_parent: null,
        mono_property_get_set_method: ['pointer', ['pointer']],
        mono_property_get_value: ['pointer', ['pointer', 'pointer', 'pointer', 'pointer']],
        mono_property_set_value: ['int', ['pointer', 'pointer', 'pointer', 'pointer']],
        mono_ptr_class_get: null,
        mono_raise_exception: null,
        mono_reflection_get_custom_attrs: null,
        mono_reflection_get_custom_attrs_blob: null,
        mono_reflection_get_custom_attrs_by_type: null,
        mono_reflection_get_custom_attrs_data: null,
        mono_reflection_get_custom_attrs_info: null,
        mono_reflection_get_token: null,
        mono_reflection_get_type: null,
        mono_reflection_parse_type: null,
        mono_reflection_type_from_name: null,
        mono_reflection_type_get_handle: null,
        mono_register_bundled_assemblies: null,
        mono_register_config_for_assembly: null,
        mono_register_machine_config: null,
        mono_remote_class: null,
        mono_runtime_class_init: null,
        mono_runtime_cleanup: null,
        mono_runtime_delegate_invoke: null,
        mono_runtime_exec_main: null,
        mono_runtime_exec_managed_code: null,
        mono_runtime_get_main_args: null,
        mono_runtime_init: null,
        mono_runtime_invoke: ['pointer', ['pointer', 'pointer', 'pointer', 'pointer']],
        mono_runtime_invoke_array: null,
        mono_runtime_is_shutting_down: null,
        mono_runtime_object_init: null,
        mono_runtime_quit: null,
        mono_runtime_run_main: null,
        mono_runtime_set_shutting_down: null,
        mono_runtime_unhandled_exception_policy_get: null,
        mono_runtime_unhandled_exception_policy_set: null,
        mono_security_enable_core_clr: null,
        mono_security_set_core_clr_platform_callback: null,
        mono_security_set_mode: null,
        mono_set_assemblies_path: null,
        mono_set_break_policy: null,
        mono_set_commandline_arguments: null,
        mono_set_config_dir: null,
        mono_set_defaults: null,
        mono_set_dirs: null,
        mono_set_find_plugin_callback: null,
        mono_set_ignore_version_and_key_when_finding_assemblies_already_loaded: null,
        mono_set_rootdir: null,
        mono_set_signal_chaining: null,
        mono_sha1_final: null,
        mono_sha1_get_digest: null,
        mono_sha1_get_digest_from_file: null,
        mono_sha1_init: null,
        mono_sha1_update: null,
        mono_signature_explicit_this: null,
        mono_signature_get_call_conv: null,
        mono_signature_get_desc: null,
        mono_signature_get_param_count: ['uint32', ['pointer']],
        mono_signature_get_params: ['pointer', ['pointer', 'pointer']],
        mono_signature_get_return_type: null,
        mono_signature_hash: null,
        mono_signature_is_instance: null,
        mono_signature_vararg_start: null,
        mono_signbit_double: null,
        mono_signbit_float: null,
        mono_stack_walk: null,
        mono_stack_walk_no_il: null,
        mono_store_remote_field: null,
        mono_store_remote_field_new: null,
        mono_string_equal: null,
        mono_string_from_utf16: null,
        mono_string_hash: null,
        mono_string_intern: null,
        mono_string_is_interned: null,
        mono_string_new: ['pointer', ['pointer', 'pointer']],
        mono_string_new_len: null,
        mono_string_new_size: null,
        mono_string_new_utf16: null,
        mono_string_new_wrapper: null,
        mono_string_to_utf16: null,
        mono_string_to_utf8: ['pointer', ['pointer']],
        mono_stringify_assembly_name: null,
        mono_table_info_get_rows: ['int', ['pointer']],
        mono_thread_abort_all_other_threads: null,
        mono_thread_attach: ['pointer', ['pointer']],
        mono_thread_cleanup: null,
        mono_thread_create: null,
        mono_thread_current: null,
        mono_thread_detach: null,
        mono_thread_exit: null,
        mono_thread_force_interruption_checkpoint: null,
        mono_thread_get_abort_signal: null,
        mono_thread_get_main: null,
        mono_thread_has_appdomain_ref: null,
        mono_thread_init: null,
        mono_thread_interruption_checkpoint: null,
        mono_thread_interruption_request_flag: null,
        mono_thread_interruption_requested: null,
        mono_thread_manage: null,
        mono_thread_new_init: null,
        mono_thread_pool_cleanup: null,
        mono_thread_pop_appdomain_ref: null,
        mono_thread_push_appdomain_ref: null,
        mono_thread_request_interruption: null,
        mono_thread_set_main: null,
        mono_thread_stop: null,
        mono_thread_suspend_all_other_threads: null,
        mono_threads_abort_appdomain_threads: null,
        mono_threads_clear_cached_culture: null,
        mono_threads_get_default_stacksize: null,
        mono_threads_install_cleanup: null,
        mono_threads_request_thread_dump: null,
        mono_threads_set_default_stacksize: null,
        mono_threads_set_shutting_down: null,
        mono_trace: null,
        mono_trace_cleanup: null,
        mono_trace_is_traced: null,
        mono_trace_pop: null,
        mono_trace_push: null,
        mono_trace_set_level: null,
        mono_trace_set_level_string: null,
        mono_trace_set_mask: null,
        mono_trace_set_mask_string: null,
        mono_tracev: null,
        mono_type_create_from_typespec: null,
        mono_type_full_name: null,
        mono_type_generic_inst_is_valuetype: null,
        mono_type_get_array_type: null,
        mono_type_get_class: ['pointer', ['pointer']],
        mono_type_get_desc: null,
        mono_type_get_modifiers: null,
        mono_type_get_name: ['pointer', ['pointer']],
        mono_type_get_name_full: null,
        mono_type_get_object: null,
        mono_type_get_ptr_type: null,
        mono_type_get_signature: null,
        mono_type_get_type: ['int', ['pointer']],
        mono_type_get_underlying_type: ['pointer', ['pointer']],
        mono_type_is_byref: null,
        mono_type_is_reference: null,
        mono_type_size: null,
        mono_type_stack_size: null,
        mono_type_to_unmanaged: null,
        mono_unhandled_exception: null,
        mono_unicode_from_external: null,
        mono_unicode_to_external: null,
        mono_unity_class_is_abstract: null,
        mono_unity_class_is_interface: null,
        mono_unity_get_all_classes_with_name_case: null,
        mono_unity_liveness_allocate_struct: null,
        mono_unity_liveness_calculation_begin: null,
        mono_unity_liveness_calculation_end: null,
        mono_unity_liveness_calculation_from_root: null,
        mono_unity_liveness_calculation_from_root_managed: null,
        mono_unity_liveness_calculation_from_statics: null,
        mono_unity_liveness_calculation_from_statics_managed: null,
        mono_unity_liveness_finalize: null,
        mono_unity_liveness_free_struct: null,
        mono_unity_liveness_start_gc_world: null,
        mono_unity_liveness_stop_gc_world: null,
        mono_unity_seh_handler: null,
        mono_unity_set_embeddinghostname: null,
        mono_unity_set_unhandled_exception_handler: null,
        mono_unity_set_vprintf_func: null,
        mono_unity_socket_security_enabled_set: null,
        mono_unity_thread_fast_attach: null,
        mono_unity_thread_fast_detach: null,
        mono_upgrade_remote_class_wrapper: null,
        mono_utf8_from_external: null,
        mono_valloc: null,
        mono_value_box: ['pointer', ['pointer', 'pointer', 'pointer']],
        mono_value_copy: null,
        mono_value_copy_array: null,
        mono_value_describe_fields: null,
        mono_verifier_set_mode: null,
        mono_verify_corlib: null,
        mono_vfree: null,
        mono_vtable_get_static_field_data: null,
        mono_walk_stack: null,
        set_vprintf_func: null,
        unity_mono_close_output: null,
        unity_mono_install_memory_callbacks: null,
        unity_mono_method_is_generic: null,
        unity_mono_method_is_inflated: null,
        unity_mono_redirect_output: null,
        unity_mono_reflection_method_get_method: null
    };
    var natives = {};
    /**
     * We iterate through all the native signatures that we defined.
     * Then we create callable functions for each signature so we can use the native functions.
     */
    var keys = Object.keys(NATIVE_SIGNATURES$1);
    var _loop_1 = function (key) {
        if (NATIVE_SIGNATURES$1[key] === null) {
            natives[key] = (function () { throw new Error('Native mono function not implemented (Signature missing): ' + key); });
            return "continue";
        }
        var address = Module.findExportByName(module.name, key);
        if (!address) {
            natives[key] = (function () { throw new Error('Native mono export not found! Expected export: ' + key); });
            return "continue";
        }
        natives[key] = new ExNativeFunction(address, NATIVE_SIGNATURES$1[key][0], NATIVE_SIGNATURES$1[key][1], NATIVE_SIGNATURES$1[key][2]);
    };
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key$1 = keys_1[_i];
        _loop_1(key$1);
    }
    /**
     * I am not sure if this is needed but i think so.
     * I guess it ensures there are no racing conditions and threads are synced.
     */
    natives.mono_thread_attach(natives.mono_get_root_domain());

    // mono_image_get_filename: ['pointer', ['pointer']],
    var mono_image_get_filename = new ExNativeFunction(address, NATIVE_SIGNATURES[key][0], NATIVE_SIGNATURES[key][1], NATIVE_SIGNATURES[key][2]);
    /**
     * Mono doc: http://docs.go-mono.com/?link=xhtml%3adeploy%2fmono-api-image.html
     */
    var cache = {};
    var MonoImage = /** @class */ (function () {
        function MonoImage(options) {
            if (options === void 0) { options = {}; }
            if (options.address) {
                this.$address = options.address;
            }
            else {
                throw new Error('Construction logic not implemented yet. (MonoImage)');
            }
        }
        Object.defineProperty(MonoImage.prototype, "fileName", {
            // See: docs.go-mono.com/monodoc.ashx?link=xhtml%3adeploy%2fmono-api-image.html#api:mono_image_get_filename
            get: function () {
                return natives.mono_image_get_filename(this.$address).readUtf8String();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MonoImage.prototype, "name", {
            // See: docs.go-mono.com/monodoc.ashx?link=xhtml%3adeploy%2fmono-api-image.html#api:mono_image_get_name
            get: function () {
                return natives.mono_image_get_name(this.$address).readUtf8String();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Static methods
         */
        // See: docs.go-mono.com/monodoc.ashx?link=xhtml%3adeploy%2fmono-api-image.html#api:mono_image_loaded
        MonoImage.loaded = function (assemblyName) {
            var address = natives.mono_image_loaded(Memory.allocUtf8String(assemblyName));
            return MonoImage.fromAddress(address);
        };
        MonoImage.fromAddress = function (address) {
            if (address.isNull())
                return null;
            var addressNumber = address.toInt32();
            if (cache[addressNumber] === undefined) {
                cache[addressNumber] = new MonoImage({ address: address });
            }
            return cache[addressNumber];
        };
        return MonoImage;
    }());

    /**
     * Mono doc: http://docs.go-mono.com/?link=xhtml%3adeploy%2fmono-api-class.html
     */
    var cache$1 = {};
    var MonoClass = /** @class */ (function () {
        function MonoClass(options) {
            if (options === void 0) { options = {}; }
            if (options.address) {
                this.$address = options.address;
            }
            else {
                throw new Error('Construction logic not implemented yet. (MonoClass)');
            }
        }
        /*// See: docs.go-mono.com/monodoc.ashx?link=xhtml%3adeploy%2fmono-api-image.html#api:mono_image_get_filename
        get fileName(): string {
          return natives.mono_image_get_filename(this.$address).readUtf8String()
        }
      
        // See: docs.go-mono.com/monodoc.ashx?link=xhtml%3adeploy%2fmono-api-image.html#api:mono_image_get_name
        get name(): string {
          return natives.mono_image_get_name(this.$address).readUtf8String()
        }*/
        // See: docs.go-mono.com/monodoc.ashx?link=xhtml%3adeploy%2fmono-api-class.html#api:mono_class_get_fields
        MonoClass.prototype.getFields = function () {
            var fields = [];
            var iter = Memory.alloc(Process.pointerSize);
            var field;
            while (!(field = natives.mono_class_get_fields(this.$address, iter)).isNull()) {
                fields.push(field);
            }
            return fields;
        };
        /**
         * Static methods
         */
        // See: docs.go-mono.com/monodoc.ashx?link=xhtml%3adeploy%2fmono-api-class.html#api:mono_class_from_name
        MonoClass.fromName = function (image, namespace, className) {
            var address = natives.mono_class_from_name(image.$address, Memory.allocUtf8String(namespace), Memory.allocUtf8String(className));
            return MonoClass.fromAddress(address);
        };
        MonoClass.fromAddress = function (address) {
            if (address.isNull())
                return null;
            var addressNumber = address.toInt32();
            if (cache$1[addressNumber] === undefined) {
                cache$1[addressNumber] = new MonoClass({ address: address });
            }
            return cache$1[addressNumber];
        };
        return MonoClass;
    }());

    var assemblyCSharp = MonoImage.loaded('Assembly-CSharp');
    var UserMessageManager = MonoClass.fromName(assemblyCSharp, '', 'UserMessageManager');
    console.log(UserMessageManager);

})));