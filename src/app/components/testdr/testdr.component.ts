import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrdenVenta } from './orden-venta.model';
import { OrdenVentaService } from './orden-venta.service';

@Component({
  selector: 'app-testdr',
  templateUrl: './testdr.component.html',
  styleUrls: ['./testdr.component.css']
})
export class TestdrComponent implements OnInit {

  // El FormGroup principal que representa todo el formulario
  public ordenForm: FormGroup;
  public isLoading = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  // Inyectamos FormBuilder junto con nuestro servicio
  constructor(
    private fb: FormBuilder,
    private _ordenVentaService: OrdenVentaService
  ) {
    // Inicializamos el formulario con su estructura y validaciones
    this.ordenForm = this.fb.group({
      cltCodigo: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      cltNombre: ['', [Validators.required, Validators.minLength(3)]],
      ordFecha: [new Date().toISOString().substring(0, 10), Validators.required], // Formato YYYY-MM-DD para el input date
      ordTotal: [{ value: 0, disabled: true }], // Campo calculado y deshabilitado
      // FormArray para manejar las líneas de detalle
      ordFilas: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    // (Opcional) Cargar datos de ejemplo al iniciar
    this.cargarDatosDeEjemplo();
  }

  // Getter para acceder fácilmente al FormArray desde la plantilla
  get ordFilasFormArray(): FormArray {
    return this.ordenForm.get('ordFilas') as FormArray;
  }

  /**
   * Crea un FormGroup para una nueva línea de detalle.
   */
  private crearFilaFormGroup(): FormGroup {
    return this.fb.group({
      itmCode: [null, Validators.required],
      itmDescrip: ['', Validators.required],
      piezas: [1, [Validators.required, Validators.min(1)]],
      prec_unit: [0, [Validators.required, Validators.min(0)]],
      total_fila: [{ value: 0, disabled: true }] // Campo calculado
    });
  }

  /**
   * Añade un nuevo grupo de detalle vacío al FormArray.
   */
  public agregarFila(): void {
    const nuevoDetalle = this.crearFilaFormGroup();
    this.ordFilasFormArray.push(nuevoDetalle);
    this.suscribirACambiosDeDetalle(nuevoDetalle);
  }

  /**
   * Elimina una línea de detalle del FormArray según su índice.
   * @param index El índice del elemento a eliminar.
   */
  public eliminarFila(index: number): void {
    this.ordFilasFormArray.removeAt(index);
    this.calcularTotalGeneral();
  }

  /**
   * Se suscribe a los cambios en 'piezas' y 'prec_unit' para calcular el total_fila.
   * @param filaGroup El FormGroup de la línea de detalle.
   */
  private suscribirACambiosDeDetalle(filaGroup: FormGroup): void {
    filaGroup.get('piezas')?.valueChanges.subscribe(() => this.calcularSubtotalFila(filaGroup));
    filaGroup.get('prec_unit')?.valueChanges.subscribe(() => this.calcularSubtotalFila(filaGroup));
  }

  /**
   * Calcula el subtotalFila para una línea de detalle específica.
   */
  private calcularSubtotalFila(filaGroup: FormGroup): void {
    const piezas = filaGroup.get('piezas')?.value || 0;
    const precio = filaGroup.get('prec_unit')?.value || 0;
    const total_fila = piezas * precio;
    // Usamos patchValue para actualizar solo un campo deshabilitado
    filaGroup.patchValue({ total_fila: total_fila.toFixed(2) });
    this.calcularTotalGeneral();
  }

  /**
   * Calcula el total de toda la orden sumando los subtotales por fila.
   */
  private calcularTotalGeneral(): void {
    const total = this.ordFilasFormArray.controls
      .reduce((acc, control) => acc + (parseFloat(control.get('total_fila')?.value) || 0), 0);
    this.ordenForm.patchValue({ ordTotal: total.toFixed(2) });
  }

  /**
   * Método que se ejecuta al enviar el formulario.
   */
  public enviarOrdenVenta(): void {
    // Marcamos todos los campos como 'touched' para mostrar errores de validación
    if (this.ordenForm.invalid) {
      this.ordenForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Usamos getRawValue() para obtener los valores de TODOS los controles,
    // incluidos los deshabilitados (como total y total_fila).
    const ordenParaEnviar: OrdenVenta = this.ordenForm.getRawValue();

    this._ordenVentaService.crearOrdenVenta(ordenParaEnviar).subscribe({
      next: (ordenCreada) => {
        this.isLoading = false;
        this.successMessage = `¡Orden #${ordenCreada.id} creada con éxito!`;
        this.ordenForm.reset(); // Limpia el formulario
        this.ordFilasFormArray.clear(); // Vacía el FormArray
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }

  // Función auxiliar para precargar el formulario con datos
  private cargarDatosDeEjemplo(): void {
    const datosEjemplo = {
      cltCodigo: 500,
      cltNombre: 'Juan Pérez',
      ordFilas: [
        { itmCode: 101, itmDescrip: 'Mouse Inalámbrico', piezas: 2, prec_unit: 350.50 },
        { itmCode: 205, itmDescrip: 'Teclado Mecánico RGB', piezas: 1, prec_unit: 1250.00 }
      ]
    };
    this.ordenForm.patchValue({
      cltCodigo: datosEjemplo.cltCodigo,
      cltNombre: datosEjemplo.cltNombre
    });
    datosEjemplo.ordFilas.forEach(detalle => {
      const filaGroup = this.crearFilaFormGroup();
      filaGroup.patchValue(detalle);
      this.ordFilasFormArray.push(filaGroup);
      this.suscribirACambiosDeDetalle(filaGroup);
      this.calcularSubtotalFila(filaGroup);
    });
  }
}
