import {
    UsePaginationInstanceProps,
    UsePaginationOptions,
    UsePaginationState,
    UseSortByColumnOptions,
    UseSortByColumnProps,
    UseSortByHooks,
    UseSortByInstanceProps,
    UseSortByOptions,
    UseSortByState,
    ColumnInterface,
    TableInstance,
    UseGlobalFiltersInstanceProps,
    UseGlobalFiltersOptions,
    UseGlobalFiltersState,
    Row,
    Cell,
    HeaderGroup,
    ColumnInstance as RTColumnInstance // Renaming to avoid conflict if ColumnInstance is imported elsewhere
} from 'react-table';

declare module 'react-table' {
    // take this file as-is, or comment out the sections that don't apply to your plugin configuration

    export interface TableOptions<D extends Record<string, unknown>>
        extends UsePaginationOptions<D>,
            UseSortByOptions<D>,
            UseGlobalFiltersOptions<D>, // Add this if you use global filters
            // note that having Record here allows you to add anything to the options, this matches the spirit of the
            // underlying js library, but might be cleaner if you define the custom properties explicitly
            Record<string, any> {}

    export interface Hooks<D extends Record<string, unknown> = Record<string, unknown>>
        extends UseSortByHooks<D> {}

    export interface TableInstance<D extends Record<string, unknown> = Record<string, unknown>>
        extends UsePaginationInstanceProps<D>,
            UseSortByInstanceProps<D>,
            UseGlobalFiltersInstanceProps<D> {} // Add this if you use global filters

    export interface TableState<D extends Record<string, unknown> = Record<string, unknown>>
        extends UsePaginationState<D>,
            UseSortByState<D>,
            UseGlobalFiltersState<D> {} // Add this if you use global filters

    export interface ColumnInterface<D extends Record<string, unknown> = Record<string, unknown>>
        extends UseSortByColumnOptions<D> {}

    // Use RTColumnInstance to refer to the original ColumnInstance
    export interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
        extends RTColumnInstance<D>, // Extend the original ColumnInstance
            UseSortByColumnProps<D> {}

    export interface Cell<D extends Record<string, unknown> = Record<string, unknown>, V = any> {}

    export interface Row<D extends Record<string, unknown> = Record<string, unknown>> {}
}