import { Producto } from '../models/producto.model.js'
import { Categoria } from '../models/categoria.model.js'
import { Ingrediente } from '../models/ingrediente.model.js'
import { ROLES } from '../config/roles.config.js'
import { Op } from 'sequelize'

export const calcularPrecioReal = (producto, tamano = { nombre: 'Mediana', factor_precio: 1.20 }) => {
  if (!producto) return 0
  const precioBase = Number(producto.precio) || 0
  if (!producto.personalizable) return Number(precioBase.toFixed(2))

  const ingredientes = producto.ingredientes || []
  const costoIngredientes = ingredientes
    .filter(i => i?.activo !== false)
    .reduce((acc, i) => acc + Number(i.costo_extra || 0), 0)

  const total = (precioBase + costoIngredientes) * Number(tamano.factor_precio)

  return Number(total.toFixed(2))
}

export const getProductos = async (req, res) => {
  try {
    const { nombre, activo, id_categoria: idCategoria, personalizable } = req.query
    const whereClause = {}

    if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` }
    if (idCategoria) whereClause.id_categoria = idCategoria
    if (personalizable !== undefined) whereClause.personalizable = personalizable === 'true'

    if (req.user?.rol === ROLES.ADMINISTRADOR || req.user?.rol === ROLES.PERSONAL) {
      if (activo !== undefined) whereClause.activo = activo === 'true'
    } else {
      whereClause.activo = true
    }

    const productos = await Producto.findAll({
      where: whereClause,
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Ingrediente, as: 'ingredientes' }
      ]
    })

    const productosConPrecio = productos.map(p => {
      const data = p.toJSON()
      data.precioReal = calcularPrecioReal(data)
      return data
    })

    res.json(productosConPrecio)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message })
  }
}

export const getProductoById = async (req, res) => {
  const { id } = req.params
  try {
    const producto = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Ingrediente, as: 'ingredientes' }
      ]
    })

    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })

    const puedeVerInactivos = [ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)
    if (!producto.activo && !puedeVerInactivos) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este producto' })
    }

    const data = producto.toJSON()
    data.precioReal = calcularPrecioReal(data)

    res.json(data)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message })
  }
}

export const createProducto = async (req, res) => {
  const { nombre, descripcion, precio, id_categoria: idCategoria, personalizable, activo, imagen_url: imagenUrl } = req.body
  try {
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      id_categoria: idCategoria,
      personalizable: personalizable ?? false,
      activo: activo ?? true,
      imagen_url: imagenUrl ?? null
    })

    res.status(201).json({ mensaje: 'Producto creado', producto: nuevoProducto })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el producto', error: error.message })
  }
}

export const updateProducto = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, precio, id_categoria: idCategoria, personalizable, activo, imagen_url: imagenUrl } = req.body
  try {
    const producto = await Producto.findByPk(id)
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })

    producto.nombre = nombre ?? producto.nombre
    producto.descripcion = descripcion ?? producto.descripcion
    producto.precio = precio ?? producto.precio
    producto.id_categoria = idCategoria ?? producto.id_categoria
    producto.personalizable = personalizable ?? producto.personalizable
    producto.activo = activo ?? producto.activo
    producto.imagen_url = imagenUrl ?? producto.imagen_url

    await producto.save()
    res.json({ mensaje: 'Producto actualizado', producto })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message })
  }
}

export const deleteProducto = async (req, res) => {
  const { id } = req.params
  try {
    const producto = await Producto.findByPk(id)
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })

    producto.activo = false
    await producto.save()
    res.json({ mensaje: 'Producto desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al desactivar producto', error: error.message })
  }
}

export const getIngredientesDeProducto = async (req, res) => {
  const { id } = req.params
  try {
    const producto = await Producto.findByPk(id, { include: { association: 'ingredientes' } })
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })

    const puedeVerInactivos = [ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)
    if (!producto.activo && !puedeVerInactivos) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver los ingredientes de este producto' })
    }

    res.json(producto.ingredientes)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ingredientes del producto', error: error.message })
  }
}

export const addIngredientesToProducto = async (req, res) => {
  const { id } = req.params
  const { ingredientes } = req.body
  try {
    const producto = await Producto.findByPk(id)
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })
    if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
      return res.status(400).json({ mensaje: 'Debe enviar un array de ingredientes' })
    }

    await producto.addIngredientes(ingredientes)
    const productoActualizado = await Producto.findByPk(id, { include: { association: 'ingredientes' } })
    res.json({ mensaje: 'Ingredientes agregados correctamente', producto: productoActualizado })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar ingredientes', error: error.message })
  }
}

export const removeIngredienteFromProducto = async (req, res) => {
  const { id, idIng } = req.params
  try {
    const producto = await Producto.findByPk(id)
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' })

    await producto.removeIngrediente(idIng)
    const productoActualizado = await Producto.findByPk(id, { include: { association: 'ingredientes' } })
    res.json({ mensaje: 'Ingrediente eliminado correctamente', producto: productoActualizado })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar ingrediente', error: error.message })
  }
}
