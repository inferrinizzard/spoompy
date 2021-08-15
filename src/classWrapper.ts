export type Class = { [key: string]: any };
export type ClassKey<T extends Class> = Extract<keyof T, string>;
export type ClassMember<T extends Class> = T[ClassKey<T>];
export type ClassFunction<T extends Class> = Extract<ClassMember<T>, Function>;

const wrapFunction =
	<
		T extends Class,
		Func extends (...args: Parameters<ClassFunction<T>>) => ReturnType<ClassFunction<T>>
	>(
		_class: T,
		fn: Func,
		callback: (res: ReturnType<Func>) => any
	) =>
	(...args: Parameters<Func>): ReturnType<Func> | Promise<ReturnType<Func>> | void => {
		try {
			const res = fn.apply(_class, args); // needs `this` reference
			callback(res);
			return res;
		} catch (e) {
			console.error(e);
		}
	};

export function wrapClassFunctions<T extends Class>(
	_class: T,
	blacklist: ClassKey<T>[] = [],
	callback: (res: ReturnType<ClassFunction<T>>) => any
): T {
	for (let fn in _class) {
		let member = _class[fn];
		if (typeof member === 'function' && !blacklist.includes(member))
			Object.defineProperty(_class, fn, {
				...Object.getOwnPropertyDescriptor(_class, fn),
				value: wrapFunction(_class, member, callback),
			});
	}
	return _class;
}
